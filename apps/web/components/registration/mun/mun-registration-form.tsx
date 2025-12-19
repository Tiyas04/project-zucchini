"use client";

import { type User } from "@repo/firebase-config";
import { MunRegistrationSchema, type MunRegistration } from "@repo/shared-types";
import { useApi } from "@repo/shared-utils/src/use-api";
import CloudinaryUploader from "../../cloudinary-uploader";
import { FormSection, InputField } from "../../ui";
import {
  basicInfoFields,
  collegeInfoFields,
  munDetailsFields,
  emergencyFields,
  teammateFields,
} from "../../../config/register/mun";
import { useFormState, renderFormFields, SubmitButton, ErrorDisplay } from "../../../utils/form";
import { useState } from "react";

interface MunRegistrationFormProps {
  user: User;
  onComplete: (userId: number, studentType: string, committeeChoice: string) => void;
}

export default function MunRegistrationForm({ user, onComplete }: MunRegistrationFormProps) {
  const { formData, errors, handleInputChange, validateForm, setErrors } =
    useFormState<MunRegistration>(
      {
        email: user.email || "",
        name: user.displayName || "",
        gender: undefined,
        studentType: undefined,
        committeeChoice: undefined,
        hasParticipatedBefore: false,
        isTeamLeader: false,
        agreedToTerms: undefined as any,
      },
      MunRegistrationSchema
    );

  const [showTeamFields, setShowTeamFields] = useState(false);

  const {
    loading: isSubmitting,
    error: submitError,
    execute: registerApi,
  } = useApi<{ userId: number }>({
    onSuccess: (response) => {
      onComplete(response.userId, formData.studentType!, formData.committeeChoice!);
    },
  });

  const handleFieldChange = (field: keyof MunRegistration, value: any) => {
    handleInputChange(field, value);

    if (field === "committeeChoice") {
      setShowTeamFields(value === "MOOT_COURT");
      if (value !== "MOOT_COURT") {
        handleInputChange("isTeamLeader", false);
        handleInputChange("teammate1Name", undefined);
        handleInputChange("teammate1Email", undefined);
        handleInputChange("teammate1Phone", undefined);
        handleInputChange("teammate2Name", undefined);
        handleInputChange("teammate2Email", undefined);
        handleInputChange("teammate2Phone", undefined);
      } else {
        handleInputChange("isTeamLeader", true);
      }
    }
  };

  const validateTeammateFields = (): boolean => {
    if (formData.committeeChoice !== "MOOT_COURT") {
      return true;
    }

    const newErrors: Partial<Record<keyof MunRegistration, string>> = {};
    const EMAIL_PATTERN = /^[a-z0-9](?:\.?[a-z0-9]){5,}@g(?:oogle)?mail\.com$/;
    const PHONE_PATTERN = /^\d{10}$/;
    const NAME_PATTERN = /^[a-zA-Z\s]+$/;

    // Validate Teammate 1
    if (!formData.teammate1Name || formData.teammate1Name.trim().length === 0) {
      newErrors.teammate1Name = "Teammate 1 name is required";
    } else if (!NAME_PATTERN.test(formData.teammate1Name)) {
      newErrors.teammate1Name = "Invalid teammate 1 name";
    }

    if (!formData.teammate1Email || formData.teammate1Email.trim().length === 0) {
      newErrors.teammate1Email = "Teammate 1 email is required";
    } else if (!EMAIL_PATTERN.test(formData.teammate1Email)) {
      newErrors.teammate1Email = "Invalid teammate 1 email. Please use Gmail";
    }

    if (!formData.teammate1Phone || formData.teammate1Phone.trim().length === 0) {
      newErrors.teammate1Phone = "Teammate 1 phone is required";
    } else if (!PHONE_PATTERN.test(formData.teammate1Phone)) {
      newErrors.teammate1Phone = "Teammate 1 phone must be 10 digits";
    }

    // Validate Teammate 2
    if (!formData.teammate2Name || formData.teammate2Name.trim().length === 0) {
      newErrors.teammate2Name = "Teammate 2 name is required";
    } else if (!NAME_PATTERN.test(formData.teammate2Name)) {
      newErrors.teammate2Name = "Invalid teammate 2 name";
    }

    if (!formData.teammate2Email || formData.teammate2Email.trim().length === 0) {
      newErrors.teammate2Email = "Teammate 2 email is required";
    } else if (!EMAIL_PATTERN.test(formData.teammate2Email)) {
      newErrors.teammate2Email = "Invalid teammate 2 email. Please use Gmail";
    }

    if (!formData.teammate2Phone || formData.teammate2Phone.trim().length === 0) {
      newErrors.teammate2Phone = "Teammate 2 phone is required";
    } else if (!PHONE_PATTERN.test(formData.teammate2Phone)) {
      newErrors.teammate2Phone = "Teammate 2 phone must be 10 digits";
    }

    // Check for duplicate emails
    const emails = [formData.email, formData.teammate1Email, formData.teammate2Email].filter(
      Boolean
    );
    if (new Set(emails).size !== emails.length) {
      if (
        formData.teammate1Email &&
        (formData.teammate1Email === formData.email ||
          formData.teammate1Email === formData.teammate2Email)
      ) {
        newErrors.teammate1Email = "All team members must have different email addresses";
      }
      if (
        formData.teammate2Email &&
        (formData.teammate2Email === formData.email ||
          formData.teammate2Email === formData.teammate1Email)
      ) {
        newErrors.teammate2Email = "All team members must have different email addresses";
      }
    }

    // Check for duplicate phones
    const phones = [formData.phone, formData.teammate1Phone, formData.teammate2Phone].filter(
      Boolean
    );
    if (new Set(phones).size !== phones.length) {
      if (
        formData.teammate1Phone &&
        (formData.teammate1Phone === formData.phone ||
          formData.teammate1Phone === formData.teammate2Phone)
      ) {
        newErrors.teammate1Phone = "All team members must have different phone numbers";
      }
      if (
        formData.teammate2Phone &&
        (formData.teammate2Phone === formData.phone ||
          formData.teammate2Phone === formData.teammate1Phone)
      ) {
        newErrors.teammate2Phone = "All team members must have different phone numbers";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTeammateFields()) {
      return;
    }
    if (!validateForm()) {
      return;
    }

    await registerApi("mun/register", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        firebaseUid: user.uid,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFormFields(basicInfoFields, formData, errors, handleFieldChange)}
        </div>
      </FormSection>

      {/* College/Institute Details */}
      <FormSection title="College / Institute Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFormFields(collegeInfoFields, formData, errors, handleFieldChange)}

          {/* ID Card Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              College/University ID Card <span className="text-red-500">*</span>
            </label>
            <CloudinaryUploader
              maxFiles={1}
              value={formData.idCard}
              onUploadComplete={(url) => handleFieldChange("idCard", url)}
            />
            {errors.idCard && <p className="mt-1 text-sm text-red-600">{errors.idCard}</p>}
          </div>
        </div>
      </FormSection>

      {/* MUN Details */}
      <FormSection title="MUN Details">
        <div className="space-y-6">
          {munDetailsFields.map((field) => (
            <div key={field.name}>
              {renderFormFields([field], formData, errors, handleFieldChange)}
              {formData.studentType === "SCHOOL" && (
                <p className="mt-1 text-sm text-amber-600">
                  Note: School students are not eligible for Overnight Crisis Committees
                </p>
              )}
              {formData.committeeChoice === "MOOT_COURT" && (
                <p className="mt-1 text-sm text-blue-600">
                  Note: For MOOT Court, you will register as team leader and provide details of 2
                  teammates
                </p>
              )}
            </div>
          ))}

          {/* Previous Participation */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasParticipatedBefore || false}
                onChange={(e) => handleFieldChange("hasParticipatedBefore", e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                I have participated in NITRUTSAV before
              </span>
            </label>
          </div>
        </div>
      </FormSection>

      {/* Team Information (conditional for MOOT Court) */}
      {showTeamFields && (
        <FormSection title="Team Information">
          <p className="text-sm text-gray-600 mb-4">
            As the team leader, please provide details of your 2 teammates
          </p>
          <div className="space-y-6">
            {teammateFields.map((teammate) => (
              <div key={teammate.number} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Teammate {teammate.number}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teammate.fields.map((field) => (
                    <InputField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      value={(formData[field.name as keyof MunRegistration] as string) || ""}
                      onChange={(value) =>
                        handleFieldChange(field.name as keyof MunRegistration, value)
                      }
                      error={errors[field.name as keyof MunRegistration]}
                      placeholder={field.placeholder}
                      required={field.required}
                      maxLength={field.maxLength}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FormSection>
      )}

      {/* Emergency & Safety Details */}
      <FormSection title="Emergency & Safety Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFormFields(emergencyFields, formData, errors, handleFieldChange)}
        </div>
      </FormSection>

      {/* Declaration & Consent */}
      <FormSection title="Declaration & Consent">
        <div className="space-y-3">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreedToTerms === true}
              onChange={(e) => handleFieldChange("agreedToTerms", e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
            />
            <span className="ml-2 text-sm text-gray-700">
              I confirm that the information provided is correct and I agree to follow NITRUTSAV
              rules & code of conduct <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.agreedToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreedToTerms}</p>
          )}
        </div>
      </FormSection>

      <ErrorDisplay error={submitError} />
      <SubmitButton
        isSubmitting={isSubmitting}
        loadingText="Registering..."
        submitText="Continue to Payment"
      />
    </form>
  );
}
