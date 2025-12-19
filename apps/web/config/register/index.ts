import type { Registration } from "@repo/shared-types";
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
