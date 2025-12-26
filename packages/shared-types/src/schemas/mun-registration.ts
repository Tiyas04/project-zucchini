import { z } from "zod";

const PATTERNS = {
  NAME: /^[a-zA-Z\s]+$/,
  EMAIL: /^[a-zA-Z0-9](?:\.?[a-zA-Z0-9])*@g(?:oogle)?mail\.com$/i,
  PHONE: /^\d{10}$/,
};

const MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID: (field: string) => `Invalid ${field.toLowerCase()}`,
  INSTITUTE_BANNED:
    "Students from this institute/university have been officially barred from participating in NITRUTSAV'26",
};

/**
 * Banned institute keywords - if any of these appear in the input, reject it
 */
const bannedKeywords = [
  "iter",
  "soa",
  "siksha o anusandhan",
  "siksha anusandhan",
  "institute of technical education and research",
];

/**
 * Check if text contains any banned keywords
 */
const containsBannedKeyword = (text: string): boolean => {
  const normalizedText = text
    .toLowerCase()
    .replace(/['\"`\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return bannedKeywords.some((keyword) => normalizedText.includes(keyword));
};

const instituteValidation = z
  .string()
  .min(1, MESSAGES.REQUIRED("Institute name"))
  .refine((val) => !containsBannedKeyword(val), {
    message: MESSAGES.INSTITUTE_BANNED,
  });

const universityValidation = z
  .string()
  .min(1, MESSAGES.REQUIRED("University/Board"))
  .refine((val) => !containsBannedKeyword(val), {
    message: MESSAGES.INSTITUTE_BANNED,
  });

export const MunRegistrationSchema = z
  .object({
    // Basic Information
    name: z
      .string()
      .min(1, MESSAGES.REQUIRED("Name"))
      .regex(PATTERNS.NAME, MESSAGES.INVALID("name")),
    gender: z.enum(["MALE", "FEMALE"], {
      errorMap: () => ({ message: "Gender is required" }),
    }),
    dateOfBirth: z.date({ required_error: "Date of birth is required" }),
    phone: z
      .string()
      .length(10, "Phone must be 10 digits")
      .regex(PATTERNS.PHONE, MESSAGES.INVALID("phone")),
    email: z.string().regex(PATTERNS.EMAIL, MESSAGES.INVALID("email. Please use Gmail")),

    // College/Institute Details
    studentType: z.enum(["SCHOOL", "COLLEGE"], {
      errorMap: () => ({ message: "Student type is required" }),
    }),
    institute: instituteValidation,
    university: universityValidation,
    city: z.string().min(1, MESSAGES.REQUIRED("City")),
    state: z.string().min(1, MESSAGES.REQUIRED("State")),
    rollNumber: z.string().min(1, MESSAGES.REQUIRED("Roll number")),
    idCard: z.string().url(MESSAGES.REQUIRED("ID card upload")),
    // MUN Specific
    committeeChoice: z.enum([
      "UNHRC",
      "UNGA_DISEC",
      "ECOSOC",
      "AIPPM",
      "IP_PHOTOGRAPHER",
      "IP_JOURNALIST",
      "UNSC_OVERNIGHT_CRISIS",
      "AIPPM_OVERNIGHT_CRISIS",
      "MOOT_COURT",
    ]),
    hasParticipatedBefore: z.boolean(),

    // Emergency
    emergencyContactName: z.string().min(1, MESSAGES.REQUIRED("Emergency contact name")),
    emergencyContactPhone: z
      .string()
      .length(10, "Emergency contact phone must be 10 digits")
      .regex(PATTERNS.PHONE, MESSAGES.INVALID("emergency phone")),
    bloodGroup: z
      .enum([
        "A_POSITIVE",
        "A_NEGATIVE",
        "B_POSITIVE",
        "B_NEGATIVE",
        "AB_POSITIVE",
        "AB_NEGATIVE",
        "O_POSITIVE",
        "O_NEGATIVE",
      ])
      .optional(),

    // Declaration
    agreedToTerms: z.literal(true, {
      errorMap: () => ({
        message: "You must agree to terms and conditions",
      }),
    }),
  })
  .refine(
    (data) => {
      // School students cannot register for Overnight Crisis Committees
      const overnightCrisisCommittees = ["UNSC_OVERNIGHT_CRISIS", "AIPPM_OVERNIGHT_CRISIS"];
      if (
        data.studentType === "SCHOOL" &&
        overnightCrisisCommittees.includes(data.committeeChoice)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "School students are not eligible for Overnight Crisis Committees",
      path: ["committeeChoice"],
    }
  )
  .refine(
    (data) => {
      // Emergency contact must be different from participant's phone
      if (data.phone === data.emergencyContactPhone) {
        return false;
      }
      return true;
    },
    {
      message: "Emergency contact number must be different from your phone number",
      path: ["emergencyContactPhone"],
    }
  );

export type MunRegistration = z.infer<typeof MunRegistrationSchema>;

// Team Registration Schema (for MOOT Court teams)
export const TeamMunRegistrationSchema = z.object({
  teamLeader: MunRegistrationSchema,
  teammate1: MunRegistrationSchema,
  teammate2: MunRegistrationSchema,
});

export type TeamMunRegistration = z.infer<typeof TeamMunRegistrationSchema>;
