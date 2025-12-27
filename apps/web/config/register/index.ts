import type { FieldConfig } from "@/utils/form";

// Basic registration fields
export const registrationFields: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
    gridSpan: "half",
  },
  {
    name: "email",
    label: "Email (Gmail only)",
    type: "email",
    placeholder: "your.email@gmail.com",
    required: true,
    gridSpan: "half",
    readonly: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "10-digit phone number",
    required: true,
    maxLength: 10,
    gridSpan: "half",
  },
  {
    name: "rollNumber",
    label: "Roll Number",
    type: "text",
    placeholder: "Enter your roll number",
    required: true,
    gridSpan: "half",
  },
  {
    name: "institute",
    label: "Institute Name",
    type: "text",
    placeholder: "Enter your institute name",
    required: true,
    gridSpan: "half",
  },
  {
    name: "university",
    label: "University Name",
    type: "text",
    placeholder: "Enter your university name",
    required: true,
    gridSpan: "half",
  },
  {
    name: "gender",
    label: "Gender",
    required: true,
    options: [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
    ],
    gridSpan: "full",
  },
];

// Optional referral field
export const referralField: FieldConfig = {
  name: "referralCode",
  label: "Referral Code (Optional)",
  type: "text",
  placeholder: "Enter referral code if you have one",
  required: false,
  gridSpan: "full",
};

// NIT Rourkela constants
export const NITR_INSTITUTE_NAME = "National Institute of Technology Rourkela";
export const NITR_UNIVERSITY_NAME = "NIT Rourkela";

// Direct abbreviations and variations for NIT Rourkela
const NITR_DIRECT_MATCHES = [
  "nitrkl",
  "nit rkl",
  "nit-rkl",
  "nit_rkl",
  "nit rou",
  "nit-rou",
  "nitrourkela",
  "nit rourkela",
  "nit-rourkela",
  "nit_rourkela",
  "rkl nit",
  "rourkela nit",
];

// Regex patterns for NIT Rourkela detection
const NITR_PATTERNS = [
  // Full name variations
  /national\s*institute\s*of\s*tech(nology)?\s*[,\-]?\s*r(ou)?r?k(e)?l(a)?/,
  // NIT + Rourkela variations
  /n\.?i\.?t\.?\s*[,\-]?\s*r(ou)?r?k(e)?l(a)?/,
  // Rourkela + NIT variations
  /r(ou)?r?k(e)?l(a)?\s*[,\-]?\s*n\.?i\.?t\.?/,
  // With "Orissa" or "Odisha"
  /nit\s*(rourkela|rkl)\s*[,\-]?\s*(orissa|odisha)?/,
  // Common typos
  /nitroukela|nitrorkela|nitrurkela/,
];

/**
 * Check if the given value represents NIT Rourkela using various abbreviations and patterns
 */
export function isNitRourkela(value: string): boolean {
  const normalized = value.toLowerCase().trim();

  // Check direct matches
  if (NITR_DIRECT_MATCHES.some((match) => normalized === match)) {
    return true;
  }

  // Check regex patterns
  if (NITR_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  // Check for partial matches with context
  const hasNit = normalized.includes("nit") || normalized.includes("national institute");
  const hasRourkela =
    normalized.includes("rourkela") ||
    normalized.includes("rkl") ||
    (normalized.includes("rou") && (normalized.includes("nit") || normalized.includes("national")));

  return hasNit && hasRourkela;
}
