"use client";

import { type User } from "@repo/firebase-config";
import { RegistrationSchema, type Registration } from "@repo/shared-types";
import { useApi } from "@repo/shared-utils/src/use-api";
import CloudinaryUploader from "../cloudinary-uploader";
import { registrationFields } from "@/config/register";
import { useFormState, renderFormFields, SubmitButton, ErrorDisplay } from "@/utils/form";

interface RegistrationFormProps {
  user: User;
  onComplete: (userId: number) => void;
}

export default function RegistrationForm({ user, onComplete }: RegistrationFormProps) {
  const { formData, errors, handleInputChange, validateForm } = useFormState<Registration>(
    {
      email: user.email || "",
      name: user.displayName || "",
      gender: undefined,
      permission: undefined as any,
      undertaking: undefined as any,
    },
    RegistrationSchema
  );

  const {
    loading: isSubmitting,
    error: submitError,
    execute: registerApi,
  } = useApi<number>({
    onSuccess: (result) => {
      onComplete(result.data.userId);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await registerApi("register", {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFormFields(registrationFields, formData, errors, handleInputChange)}
      </div>

      {/* ID Card Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          College/University ID Card <span className="text-red-500">*</span>
        </label>
        <CloudinaryUploader
          maxFiles={1}
          value={formData.idCard}
          onUploadComplete={(url) => handleInputChange("idCard", url)}
        />
        {errors.idCard && <p className="mt-1 text-sm text-red-600">{errors.idCard}</p>}
      </div>

      {/* Referral Code */}
      {/* {renderFormFields([referralField], formData, errors, handleInputChange)} */}

      {/* Permission Document Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Permission Document from Institute <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Upload a signed permission letter from your institute's authority
        </p>
        <CloudinaryUploader
          maxFiles={1}
          value={formData.permission as any}
          onUploadComplete={(url) => handleInputChange("permission", url)}
        />
        {errors.permission && <p className="mt-1 text-sm text-red-600">{errors.permission}</p>}
      </div>

      {/* Undertaking Document Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Undertaking Document <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Upload a signed undertaking/declaration document accepting terms and conditions
        </p>
        <CloudinaryUploader
          maxFiles={1}
          value={formData.undertaking as any}
          onUploadComplete={(url) => handleInputChange("undertaking", url)}
        />
        {errors.undertaking && <p className="mt-1 text-sm text-red-600">{errors.undertaking}</p>}
      </div>

      <ErrorDisplay error={submitError} />
      <SubmitButton
        isSubmitting={isSubmitting}
        loadingText="Registering..."
        submitText="Continue to Payment"
      />
    </form>
  );
}
