"use client";

import { type User } from "@repo/firebase-config";
import { registrationFields } from "@/config/register";
import { renderFormFields, SubmitButton, ErrorDisplay } from "@/utils/form";
import { useRegistrationForm } from "@/hooks/use-registration-form";
import NitrToggle from "./nitr-toggle";
import InstituteField from "./institute-field";
import DocumentUpload from "./document-upload";

interface RegistrationFormProps {
  user: User;
  onComplete: (isNitrStudent: boolean) => void;
}

export default function RegistrationForm({ user, onComplete }: RegistrationFormProps) {
  const {
    formData,
    errors,
    isNitrStudent,
    isSubmitting,
    submitError,
    setIsNitrStudent,
    handleInputChange,
    handleInstituteChange,
    handleSubmit,
  } = useRegistrationForm({ user, onComplete });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <NitrToggle isNitrStudent={isNitrStudent} onToggle={setIsNitrStudent} />

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFormFields(
          registrationFields
            .filter((field) => field.name !== "institute" && field.name !== "university")
            .map((field) => ({ ...field })),
          formData,
          errors,
          handleInputChange
        )}

        <InstituteField
          value={formData.institute}
          universityValue={formData.university}
          isNitrStudent={isNitrStudent}
          instituteError={errors.institute}
          universityError={errors.university}
          onInstituteChange={handleInstituteChange}
          onUniversityChange={(v) => handleInputChange("university", v)}
        />
      </div>

      {/* ID Card Upload */}
      <DocumentUpload
        label="College/University ID Card"
        value={formData.idCard}
        error={errors.idCard}
        onUploadComplete={(url) => handleInputChange("idCard", url)}
      />

      {/* Permission Document Upload - Only for non-NITR students */}
      {!isNitrStudent && (
        <DocumentUpload
          label="Permission Document from Institute"
          description="Upload a signed permission letter from your institute's authority"
          value={formData.permission as any}
          error={errors.permission}
          onUploadComplete={(url) => handleInputChange("permission", url)}
        />
      )}

      {/* Undertaking Document Upload - Only for non-NITR students */}
      {!isNitrStudent && (
        <DocumentUpload
          label="Undertaking Document"
          description="Upload a signed undertaking/declaration document accepting terms and conditions"
          value={formData.undertaking as any}
          error={errors.undertaking}
          onUploadComplete={(url) => handleInputChange("undertaking", url)}
        />
      )}

      <ErrorDisplay error={submitError} />
      <SubmitButton
        isSubmitting={isSubmitting}
        loadingText="Registering..."
        submitText={isNitrStudent ? "Complete Registration" : "Continue to Payment"}
      />
    </form>
  );
}
