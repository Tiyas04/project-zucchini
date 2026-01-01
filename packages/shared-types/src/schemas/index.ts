import { z } from "zod";

/**
 * Blocked institutes list
 * Students from these institutes are not allowed to register
 */
export const notAllowedInstitutes = [
  "Siksha O Anusandhan",
  "Siksha 'O' Anusandhan",
  'Siksha "O" Anusandhan',
  "Siksha-O-Anusandhan",
  "Siksha o Anusandhan",
  "Siksha 0 Anusandhan",

  "Siksha O Anusandhan (SOA)",
  "Siksha O Anusandhan - SOA",
  "Siksha 'O' Anusandhan SOA",
  "Siksha 0 Anusandhan SOA",
  "Siksha O Anushandhan SOA",
  "Siksha-O-Anusandhan SOA",

  "Siksha O Anusandhan Institute of Technical Education and Research",
  "Siksha 'O' Anusandhan Institute of Technical Education and Research",
  "Siksha 0 Anusandhan Institute of Technical Education and Research",
  "Siksha-O-Anusandhan Institute of Technical Education and Research",

  "SOA",
  "S.O.A",
  "S.O.A.",
  "SoA",

  "ITER",
  "I.T.E.R",
  "I.T.E.R.",

  "Institute of Technical Education and Research",
  "Institute of Technical Education & Research",
  "Institute of Technical Education And Research",

  "Institute of Technical Education and Research SOA",
  "Institute of Technical Education & Research SOA",
  "Institute of Technical Education and Research (SOA)",
  "ITER SOA",
  "ITER-SOA",
  "ITER - SOA",

  "Siksha O Anusandhan",
  "Siksha O Anusandhaan",
  "Sikha O Anusandhan",
  "Siksha O Anushandan",

  "siksha o anusandhan",
  "soa",
  "iter",
];

/**
 * Validation patterns
 */
const PATTERNS = {
  NAME: /^[a-zA-Z\s]+$/,
  EMAIL: /^[a-z0-9](?:\.?[a-z0-9]){5,}@g(?:oogle)?mail\.com$/,
  PHONE: /^\d{10}$/,
  REFERRAL: /^[A-Z]{2,4}\d{6,8}$/, // Format: NAME(2-4 uppercase) + digits (6-8)
};

/**
 * Validation messages
 */
const MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID: (field: string) => `Invalid ${field.toLowerCase()}`,
  INSTITUTE_BANNED:
    "Students from this institute/university have been officially barred from participating in NITRUTSAV'26",
  PERMISSION_REQUIRED: "You must have permission from your institute's authority",
  TERMS_REQUIRED: "You must agree to the terms and conditions",
  GENDER_REQUIRED: "Gender selection is required and must be either male or female",
};

/**
 * Normalize text for comparison
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/['"`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizedBlockedInstitutes = new Set(notAllowedInstitutes.map(normalizeText));

const institutionValidation = z
  .string()
  .min(1, MESSAGES.REQUIRED("Institution name"))
  .transform(normalizeText)
  .refine((val) => !normalizedBlockedInstitutes.has(val), {
    message: MESSAGES.INSTITUTE_BANNED,
  });

/**
 * Registration DTO Schema
 * Represents user registration data with comprehensive validation
 */
export const RegistrationSchema = z.object({
  name: z.string().min(1, MESSAGES.REQUIRED("Name")).regex(PATTERNS.NAME, MESSAGES.INVALID("name")),

  email: z
    .string()
    .regex(PATTERNS.EMAIL, MESSAGES.INVALID("email address. Please use your Gmail address")),

  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(PATTERNS.PHONE, MESSAGES.INVALID("phone number")),

  institute: institutionValidation,
  university: institutionValidation,

  idCard: z.string().url(MESSAGES.REQUIRED("ID Card")),

  // payment: z.string().url(MESSAGES.REQUIRED("Payment receipt")),

  rollNumber: z.string().min(1, MESSAGES.REQUIRED("Roll number")),

  referralCode: z
    .string()
    .regex(PATTERNS.REFERRAL, MESSAGES.INVALID("referral code"))
    .optional()
    .or(z.literal("")),

  permission: z.string().url(MESSAGES.REQUIRED("Permission document")),

  gender: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: MESSAGES.GENDER_REQUIRED }),
  }),

  undertaking: z.string().url(MESSAGES.REQUIRED("Undertaking document")),

  wantsAccommodation: z.boolean().optional().default(false),

  // transactionID: z.string().min(1, MESSAGES.REQUIRED("Transaction ID")),

  registeredAt: z
    .date()
    .optional()
    .default(() => new Date()),

  isVerified: z
    .boolean()
    .optional()
    .default(() => false),
});

export type Registration = z.infer<typeof RegistrationSchema>;

/**
 * Export all schemas for code generation
 */
export const schemas = {
  Registration: RegistrationSchema,
};

// MUN Registration Schema
export {
  MunRegistrationSchema,
  type MunRegistration,
  TeamMunRegistrationSchema,
  type TeamMunRegistration,
} from "./mun-registration";
