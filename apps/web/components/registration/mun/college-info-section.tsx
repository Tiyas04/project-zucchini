import type { MunRegistration } from "@repo/shared-types";
import SearchableSelect from "../../ui/searchable-select";
import CloudinaryUploader from "../../cloudinary-uploader";
import InputField from "../../ui/input-field";
import { collegeOptions, OTHER_COLLEGE_VALUE } from "../../../config/register/colleges";
import { collegeInfoFields } from "../../../config/register/mun";
import { isNitRourkela } from "../../../config/register";
import { renderFormFields } from "../../../utils/form";

interface CollegeInfoSectionProps {
  formData: Partial<MunRegistration>;
  errors: Record<string, string>;
  isNitrStudent: boolean;
  lockNitrStatus: boolean;
  handleFieldChange: (field: keyof MunRegistration, value: any) => void;
  handleInstituteBlur: () => void;
  handleUniversityBlur: () => void;
  hideStudentType?: boolean;
  /** Callback when NIT Rourkela is detected from dropdown selection */
  onNitrStudentDetected?: () => void;
}

export function CollegeInfoSection({
  formData,
  errors,
  isNitrStudent,
  lockNitrStatus,
  handleFieldChange,
  handleInstituteBlur,
  handleUniversityBlur,
  hideStudentType,
  onNitrStudentDetected,
}: CollegeInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Student Type */}
      {!hideStudentType &&
        renderFormFields(
          collegeInfoFields
            .filter((field) => field.name === "studentType")
            .map((field) => ({
              ...field,
              readonly: isNitrStudent,
            })),
          formData,
          errors,
          handleFieldChange
        )}

      {/* Roll Number */}
      {renderFormFields(
        collegeInfoFields.filter((field) => field.name === "rollNumber"),
        formData,
        errors,
        handleFieldChange
      )}

      {/* School Student Note */}
      {formData.studentType === "SCHOOL" && (
        <div className="md:col-span-3 bg-amber-500/20 border-2 border-amber-400/50 rounded-[13px] p-3 backdrop-blur-[9.25px]">
          <p className="text-sm text-amber-200">
            <strong>Note for School Students:</strong> Enter your school name in "Institute Name"
            and your board (e.g., CBSE, ICSE, State Board) in "University/Board".
          </p>
        </div>
      )}

      {/* Institute Name - Searchable Dropdown for College, Text for School */}
      {formData.studentType !== "SCHOOL" && !isNitrStudent ? (
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-white mb-2">
            Institute Name <span className="asterisk-icon">*</span>
          </label>
          <SearchableSelect
            options={[
              // Mark NITR as disabled when lockNitrStatus=true and isNitrStudent=false
              ...collegeOptions.map((c) => ({
                label: c.label,
                value: c.value,
                disabled:
                  lockNitrStatus &&
                  !isNitrStudent &&
                  c.value.toLowerCase().includes("nit rourkela"),
              })),
              { label: "Other (Enter manually)", value: OTHER_COLLEGE_VALUE },
            ]}
            value={formData.institute}
            onChange={(value) => {
              const selectedCollege = collegeOptions.find((c) => c.value === value);

              // Check if NIT Rourkela is selected and notify parent
              if (isNitRourkela(value) && onNitrStudentDetected) {
                onNitrStudentDetected();
              }

              if (selectedCollege) {
                handleFieldChange("institute", selectedCollege.value);
                handleFieldChange("university", selectedCollege.value);
                handleFieldChange("city", selectedCollege.city);
                handleFieldChange("state", selectedCollege.state);
              } else {
                handleFieldChange("institute", value);
              }
            }}
            onBlur={handleInstituteBlur}
            placeholder="Search for your college..."
            disabled={isNitrStudent}
            error={errors.institute}
            allowCustom={true}
            customPlaceholder="Enter your college/institute name..."
          />
        </div>
      ) : (
        <InputField
          label="Institute Name"
          name="institute"
          type="text"
          value={formData.institute || ""}
          onChange={(value) => handleFieldChange("institute", value)}
          placeholder={
            formData.studentType === "SCHOOL"
              ? "Enter your school name"
              : "Enter your institute name"
          }
          readonly={isNitrStudent}
          error={errors.institute}
          required
          className="md:col-span-3"
        />
      )}

      {/* University/Board - Auto-filled for College, Editable for School */}
      <InputField
        label="University / Board"
        name="university"
        type="text"
        value={formData.university || ""}
        onChange={(value) => !isNitrStudent && handleFieldChange("university", value)}
        placeholder={
          formData.studentType === "SCHOOL"
            ? "Enter your board (CBSE, ICSE, State Board, etc.)"
            : "Enter your university name"
        }
        readonly={isNitrStudent}
        error={errors.university}
        required
      />

      {/* City */}
      <InputField
        label="City"
        name="city"
        type="text"
        value={formData.city || ""}
        onChange={(value) => !isNitrStudent && handleFieldChange("city", value)}
        placeholder="Enter your city"
        readonly={isNitrStudent}
        error={errors.city}
        required
      />

      {/* State */}
      <InputField
        label="State"
        name="state"
        type="text"
        value={formData.state || ""}
        onChange={(value) => !isNitrStudent && handleFieldChange("state", value)}
        placeholder="Enter your state"
        readonly={isNitrStudent}
        error={errors.state}
        required
      />

      {/* ID Card Upload */}
      <div className="md:col-span-3">
        <label className="block text-sm font-semibold text-white mb-2">
          College/University ID Card <span className="asterisk-icon">*</span>
        </label>
        <CloudinaryUploader
          maxFiles={1}
          value={formData.idCard}
          onUploadComplete={(url) => handleFieldChange("idCard", url)}
        />
        {errors.idCard && <p className="mt-1 text-sm text-red-600">{errors.idCard}</p>}
      </div>
    </div>
  );
}
