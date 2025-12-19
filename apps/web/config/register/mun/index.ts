import type { MunRegistration } from "@repo/shared-types";
import type { FieldConfig } from "@/utils/form";

// Basic Information Fields
export const basicInfoFields: FieldConfig[] = [
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
  },
  {
    name: "phone",
    label: "Phone Number (WhatsApp)",
    type: "tel",
    placeholder: "10-digit phone number",
    required: true,
    maxLength: 10,
    gridSpan: "half",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
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

// College/Institute Details Fields
export const collegeInfoFields: FieldConfig[] = [
  {
    name: "studentType",
    label: "Student Type",
    required: true,
    options: [
      { value: "SCHOOL", label: "School Student" },
      { value: "COLLEGE", label: "College Student" },
    ],
    gridSpan: "full",
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
    label: "University / Board",
    type: "text",
    placeholder: "Enter your university/board name",
    required: true,
    gridSpan: "half",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "Enter your city",
    required: true,
    gridSpan: "half",
  },
  {
    name: "state",
    label: "State",
    type: "text",
    placeholder: "Enter your state",
    required: true,
    gridSpan: "half",
  },
  {
    name: "rollNumber",
    label: "College ID / Roll Number",
    type: "text",
    placeholder: "Enter your roll number",
    required: true,
    gridSpan: "half",
  },
];

// MUN Details Fields
export const munDetailsFields: FieldConfig[] = [
  {
    name: "committeeChoice",
    label: "Committee Choice",
    placeholder: "Select a committee",
    required: true,
    options: [
      { value: "OVERNIGHT_CRISIS", label: "Overnight Crisis Committee" },
      { value: "MOOT_COURT", label: "MOOT Court (Team of 3)" },
    ],
    gridSpan: "full",
  },
];

// Emergency & Safety Fields
export const emergencyFields: FieldConfig[] = [
  {
    name: "emergencyContactName",
    label: "Emergency Contact Name",
    type: "text",
    placeholder: "Emergency contact name",
    required: true,
    gridSpan: "half",
  },
  {
    name: "emergencyContactPhone",
    label: "Emergency Contact Number",
    type: "tel",
    placeholder: "10-digit phone number",
    required: true,
    maxLength: 10,
    helperText: "Must be different from your phone number",
    gridSpan: "half",
  },
  {
    name: "bloodGroup",
    label: "Blood Group (Optional)",
    placeholder: "Select blood group",
    required: false,
    options: [
      { value: "A_POSITIVE", label: "A+" },
      { value: "A_NEGATIVE", label: "A-" },
      { value: "B_POSITIVE", label: "B+" },
      { value: "B_NEGATIVE", label: "B-" },
      { value: "AB_POSITIVE", label: "AB+" },
      { value: "AB_NEGATIVE", label: "AB-" },
      { value: "O_POSITIVE", label: "O+" },
      { value: "O_NEGATIVE", label: "O-" },
    ],
    gridSpan: "half",
  },
];

// Team Information Fields
export const teammateFields = [
  {
    number: 1,
    fields: [
      {
        name: "teammate1Name",
        label: "Name",
        type: "text" as const,
        placeholder: "Teammate 1 name",
        required: true,
      },
      {
        name: "teammate1Email",
        label: "Email",
        type: "email" as const,
        placeholder: "teammate1@gmail.com",
        required: true,
      },
      {
        name: "teammate1Phone",
        label: "Phone",
        type: "tel" as const,
        placeholder: "10-digit number",
        required: true,
        maxLength: 10,
      },
    ],
  },
  {
    number: 2,
    fields: [
      {
        name: "teammate2Name",
        label: "Name",
        type: "text" as const,
        placeholder: "Teammate 2 name",
        required: true,
      },
      {
        name: "teammate2Email",
        label: "Email",
        type: "email" as const,
        placeholder: "teammate2@gmail.com",
        required: true,
      },
      {
        name: "teammate2Phone",
        label: "Phone",
        type: "tel" as const,
        placeholder: "10-digit number",
        required: true,
        maxLength: 10,
      },
    ],
  },
];
