import { z } from "zod";

const PATTERNS = {
  NAME: /^[a-zA-Z\s]+$/,
  EMAIL: /^[a-z0-9](?:\.?[a-z0-9]){5,}@g(?:oogle)?mail\.com$/,
  PHONE: /^\d{10}$/,
};

const MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID: (field: string) => `Invalid ${field.toLowerCase()}`,
};

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
    institute: z.string().min(1, MESSAGES.REQUIRED("Institute name")),
    university: z.string().min(1, MESSAGES.REQUIRED("University/Board")),
    city: z.string().min(1, MESSAGES.REQUIRED("City")),
    state: z.string().min(1, MESSAGES.REQUIRED("State")),
    rollNumber: z.string().min(1, MESSAGES.REQUIRED("Roll number")),
    idCard: z.string().url(MESSAGES.REQUIRED("ID card upload")),

    // MUN Specific
    committeeChoice: z.enum(["OVERNIGHT_CRISIS", "MOOT_COURT"]),
    hasParticipatedBefore: z.boolean(),

    // Team (required only for MOOT Court - Option A)
    isTeamLeader: z.boolean().default(false),
    teammate1Name: z.string().optional(),
    teammate1Email: z.string().optional(),
    teammate1Phone: z.string().optional(),
    teammate2Name: z.string().optional(),
    teammate2Email: z.string().optional(),
    teammate2Phone: z.string().optional(),

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
      // School students cannot register for Overnight Crisis
      if (data.studentType === "SCHOOL" && data.committeeChoice === "OVERNIGHT_CRISIS") {
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
  )
  .refine(
    (data) => {
      // MOOT Court requires team information
      if (data.committeeChoice === "MOOT_COURT") {
        return !!data.teammate1Name && data.teammate1Name.trim().length > 0;
      }
      return true;
    },
    {
      message: "Teammate 1 name is required",
      path: ["teammate1Name"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT" && data.teammate1Name) {
        return PATTERNS.NAME.test(data.teammate1Name);
      }
      return true;
    },
    {
      message: "Invalid teammate 1 name",
      path: ["teammate1Name"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT") {
        return !!data.teammate1Email && data.teammate1Email.trim().length > 0;
      }
      return true;
    },
    {
      message: "Teammate 1 email is required",
      path: ["teammate1Email"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT" && data.teammate1Email) {
        return PATTERNS.EMAIL.test(data.teammate1Email);
      }
      return true;
    },
    {
      message: "Invalid teammate 1 email. Please use Gmail",
      path: ["teammate1Email"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT") {
        return !!data.teammate1Phone && data.teammate1Phone.trim().length > 0;
      }
      return true;
    },
    {
      message: "Teammate 1 phone is required",
      path: ["teammate1Phone"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT" && data.teammate1Phone) {
        return PATTERNS.PHONE.test(data.teammate1Phone);
      }
      return true;
    },
    {
      message: "Teammate 1 phone must be 10 digits",
      path: ["teammate1Phone"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT") {
        return !!data.teammate2Name && data.teammate2Name.trim().length > 0;
      }
      return true;
    },
    {
      message: "Teammate 2 name is required",
      path: ["teammate2Name"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT" && data.teammate2Name) {
        return PATTERNS.NAME.test(data.teammate2Name);
      }
      return true;
    },
    {
      message: "Invalid teammate 2 name",
      path: ["teammate2Name"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT") {
        return !!data.teammate2Email && data.teammate2Email.trim().length > 0;
      }
      return true;
    },
    {
      message: "Teammate 2 email is required",
      path: ["teammate2Email"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT" && data.teammate2Email) {
        return PATTERNS.EMAIL.test(data.teammate2Email);
      }
      return true;
    },
    {
      message: "Invalid teammate 2 email. Please use Gmail",
      path: ["teammate2Email"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT") {
        return !!data.teammate2Phone && data.teammate2Phone.trim().length > 0;
      }
      return true;
    },
    {
      message: "Teammate 2 phone is required",
      path: ["teammate2Phone"],
    }
  )
  .refine(
    (data) => {
      if (data.committeeChoice === "MOOT_COURT" && data.teammate2Phone) {
        return PATTERNS.PHONE.test(data.teammate2Phone);
      }
      return true;
    },
    {
      message: "Teammate 2 phone must be 10 digits",
      path: ["teammate2Phone"],
    }
  )
  .refine(
    (data) => {
      // For MOOT Court, ensure teammate emails are unique
      if (data.committeeChoice === "MOOT_COURT") {
        const emails = [data.email, data.teammate1Email, data.teammate2Email].filter(Boolean);
        const uniqueEmails = new Set(emails);
        return uniqueEmails.size === emails.length;
      }
      return true;
    },
    {
      message: "All team members must have different email addresses",
      path: ["teammate2Email"],
    }
  )
  .refine(
    (data) => {
      // For MOOT Court, ensure teammate phones are unique
      if (data.committeeChoice === "MOOT_COURT") {
        const phones = [data.phone, data.teammate1Phone, data.teammate2Phone].filter(Boolean);
        const uniquePhones = new Set(phones);
        return uniquePhones.size === phones.length;
      }
      return true;
    },
    {
      message: "All team members must have different phone numbers",
      path: ["teammate2Phone"],
    }
  );

export type MunRegistration = z.infer<typeof MunRegistrationSchema>;
