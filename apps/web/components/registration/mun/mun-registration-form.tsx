"use client";

import { type User } from "@repo/firebase-config";
import { MunRegistrationSchema, type MunRegistration } from "@repo/shared-types";
import { useApi } from "@repo/shared-utils";
import { FormSection } from "../../ui";
import { basicInfoFields, emergencyFields } from "../../../config/register/mun";
import { useFormState, renderFormFields, ErrorDisplay } from "../../../utils/form";
import { useEffect } from "react";
import { useMunFormValidation } from "@/hooks/use-mun-form-validation";
import { NitrCheckbox } from "./nitr-checkbox";
import { CollegeInfoSection } from "./college-info-section";
import { MunDetailsSection } from "./mun-details-section";

interface MunRegistrationFormProps {
  user: User;
  onComplete: (
    studentType: string,
    committeeChoice: string,
    registrationData: MunRegistration,
    isNitrStudent: boolean
  ) => void;
  stepTitle?: string;
  initialData?: Partial<MunRegistration>;
  hideCommitteeChoice?: boolean;
  buttonText?: string;
  clearUserDetails?: boolean;
  isNitrStudent: boolean;
  setIsNitrStudent: (value: boolean) => void;
  onBack?: () => void;
  /** If true, the NITR student checkbox is locked and cannot be changed (for Moot Court teammates) */
  lockNitrStatus?: boolean;
  hideStudentType?: boolean;
}

export default function MunRegistrationForm({
  user,
  onComplete,
  stepTitle,
  initialData,
  hideCommitteeChoice = false,
  buttonText = "Continue to Payment",
  clearUserDetails = false,
  isNitrStudent,
  setIsNitrStudent,
  onBack,
  lockNitrStatus = false,
  hideStudentType = false,
}: MunRegistrationFormProps) {
  const processedInitialData: Partial<MunRegistration> = initialData
    ? {
        ...initialData,
        dateOfBirth:
          initialData.dateOfBirth &&
          typeof initialData.dateOfBirth === "string" &&
          (initialData.dateOfBirth as string).includes("T")
            ? new Date(initialData.dateOfBirth)
            : initialData.dateOfBirth,
      }
    : {};

  const { formData, errors, handleInputChange, validateForm, setErrors, setFormData } =
    useFormState<MunRegistration>(
      {
        email: clearUserDetails ? "" : processedInitialData?.email || user.email || "",
        name: clearUserDetails ? "" : processedInitialData?.name || user.displayName || "",
        gender: processedInitialData?.gender || undefined,
        studentType: processedInitialData?.studentType || undefined,
        committeeChoice: processedInitialData?.committeeChoice || undefined,
        hasParticipatedBefore: processedInitialData?.hasParticipatedBefore || false,
        agreedToTerms: undefined as any,
        ...processedInitialData,
      },
      MunRegistrationSchema
    );

  useEffect(() => {
    if (isNitrStudent) {
      setFormData((prev) => ({
        ...prev,
        studentType: "COLLEGE",
        institute: "National Institute of Technology Rourkela",
        university: "National Institute of Technology Rourkela",
        city: "Rourkela",
        state: "Odisha",
      }));
    }
  }, [isNitrStudent, setFormData]);

  const { error: submitError } = useApi({});

  const {
    validateInstituteField,
    validateInstituteOnBlur,
    validateUniversityOnBlur,
    getSubmitButtonText: getButtonText,
  } = useMunFormValidation(isNitrStudent, lockNitrStatus, setErrors);

  const handleFieldChange = (field: keyof MunRegistration, value: any) => {
    // Prevent non-NITR teammates from selecting NITR as their institute
    if (field === "institute" && lockNitrStatus && !isNitrStudent) {
      if (!validateInstituteField(value || "")) {
        return; // Don't update the value
      }
    }
    handleInputChange(field, value);
  };

  const handleInstituteBlur = () => {
    validateInstituteOnBlur(formData.institute);
  };

  const handleUniversityBlur = () => {
    validateUniversityOnBlur(formData.university);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const registrationData = {
      ...formData,
      dateOfBirth:
        typeof formData.dateOfBirth === "string"
          ? new Date(formData.dateOfBirth)
          : formData.dateOfBirth,
    } as MunRegistration;

    onComplete(formData.studentType!, formData.committeeChoice!, registrationData, isNitrStudent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <NitrCheckbox
        isNitrStudent={isNitrStudent}
        setIsNitrStudent={setIsNitrStudent}
        lockNitrStatus={lockNitrStatus}
        stepTitle={stepTitle}
        hideCommitteeChoice={hideCommitteeChoice}
      />

      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFormFields(
            basicInfoFields.map((field) => ({
              ...field,
              readonly: field.name === "email" ? !clearUserDetails : field.readonly,
            })),
            formData,
            errors,
            handleFieldChange
          )}
        </div>
      </FormSection>

      <CollegeInfoSection
        formData={formData}
        errors={errors}
        isNitrStudent={isNitrStudent}
        lockNitrStatus={lockNitrStatus}
        handleFieldChange={handleFieldChange}
        handleInstituteBlur={handleInstituteBlur}
        handleUniversityBlur={handleUniversityBlur}
        hideStudentType={hideStudentType}
        onNitrStudentDetected={() => setIsNitrStudent(true)}
      />

      {!hideCommitteeChoice && (
        <MunDetailsSection
          formData={formData}
          errors={errors}
          handleFieldChange={handleFieldChange}
        />
      )}

      <FormSection title="Emergency & Safety Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFormFields(emergencyFields, formData, errors, handleFieldChange)}
        </div>
      </FormSection>

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

      <div className="flex justify-between items-center pt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ← Back
          </button>
        )}

        <div className={onBack ? "" : "ml-auto"}>
          <button
            type="submit"
            disabled={false}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getButtonText(formData.committeeChoice, hideCommitteeChoice, buttonText)}
          </button>
        </div>
      </div>
    </form>
  );
}
