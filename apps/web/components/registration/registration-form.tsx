"use client";

import { type User } from "@repo/firebase-config";
import { registrationFields, referralField } from "@/config/register";
import { renderFormFields, SubmitButton, ErrorDisplay } from "@/utils/form";
import { useRegistrationForm } from "@/hooks/use-registration-form";
import { NITRUTSAV_FEES } from "@/config";
import NitrToggle from "./nitr-toggle";
import AccommodationSelector from "./accommodation-selector";
import InstituteField from "./institute-field";
import DocumentUpload from "./document-upload";

interface RegistrationFormProps {
  user: User;
  onComplete: (isNitrStudent: boolean, wantsAccommodation: boolean, referralCode?: string) => void;
}

export default function RegistrationForm({ user, onComplete }: RegistrationFormProps) {
  const {
    formData,
    errors,
    isNitrStudent,
    wantsAccommodation,
    isSubmitting,
    submitError,
    setIsNitrStudent,
    setWantsAccommodation,
    handleInputChange,
    handleInstituteChange,
    handleSubmit,
  } = useRegistrationForm({ user, onComplete });

  const registrationFee = wantsAccommodation
    ? NITRUTSAV_FEES.withAccomodation
    : NITRUTSAV_FEES.withoutAccomodation;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <NitrToggle isNitrStudent={isNitrStudent} onToggle={setIsNitrStudent} />

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Accommodation Selection - Only for non-NITR students */}
        {!isNitrStudent && (
          <AccommodationSelector
            wantsAccommodation={wantsAccommodation}
            onToggle={setWantsAccommodation}
          />
        )}

        {/* Referral Code - Optional */}
        {renderFormFields([referralField], formData, errors, handleInputChange)}
      </div>

      {/* Document Uploads - Compact Layout */}
      <div className={`grid grid-cols-1 ${!isNitrStudent ? "md:grid-cols-3" : ""} gap-4`}>
        {/* ID Card Upload */}
        <DocumentUpload
          label="College/University ID Card"
          description="Clear picture of your ID card"
          value={formData.idCard}
          error={errors.idCard}
          onUploadComplete={(url) => handleInputChange("idCard", url)}
          compact
        />

        {/* Permission Document Upload - Only for non-NITR students */}
        {!isNitrStudent && (
          <DocumentUpload
            label="Permission Document"
            description="Signed permission from institute"
            value={formData.permission as any}
            error={errors.permission}
            onUploadComplete={(url) => handleInputChange("permission", url)}
            compact
          />
        )}

        {/* Undertaking Document Upload - Only for non-NITR students */}
        {!isNitrStudent && (
          <DocumentUpload
            label="Undertaking Document"
            description="Signed declaration document"
            value={formData.undertaking as any}
            error={errors.undertaking}
            onUploadComplete={(url) => handleInputChange("undertaking", url)}
            compact
          />
        )}
      </div>

      <ErrorDisplay error={submitError} />

      {/* Pricing Summary - Only for non-NITR students */}
      {!isNitrStudent && (
        <div className="border-2 border-white/40 rounded-[13px] p-4  backdrop-blur-[9.25px]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-white">Registration Fee</p>
              <p className="text-xs text-white/60">
                {wantsAccommodation ? "With Accommodation" : "Without Accommodation"}
              </p>
            </div>
            <p className="text-2xl font-bold text-white">₹{registrationFee}</p>
          </div>
        </div>
      )}

      <SubmitButton
        isSubmitting={isSubmitting}
        loadingText="Registering..."
        submitText={isNitrStudent ? "Complete Registration" : "Continue to Payment"}
      />
    </form>
  );
}
