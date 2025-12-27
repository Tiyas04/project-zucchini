import type { MunRegistration } from "@repo/shared-types";
import SearchableSelect from "../../ui/searchable-select";
import CloudinaryUploader from "../../cloudinary-uploader";
import { FormSection } from "../../ui";
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
    <FormSection title="College / Institute Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="md:col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700">
              <strong>Note for School Students:</strong> Enter your school name in "Institute Name"
              and your board (e.g., CBSE, ICSE, State Board) in "University/Board".
            </p>
          </div>
        )}

        {/* Institute Name - Searchable Dropdown for College, Text for School */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Institute Name <span className="text-red-500">*</span>
          </label>
          {formData.studentType !== "SCHOOL" && !isNitrStudent ? (
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
          ) : (
            <input
              type="text"
              value={formData.institute || ""}
              onChange={(e) => handleFieldChange("institute", e.target.value)}
              placeholder={
                formData.studentType === "SCHOOL"
                  ? "Enter your school name"
                  : "Enter your institute name"
              }
              disabled={isNitrStudent}
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.institute ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
              } ${isNitrStudent ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          )}
          {errors.institute && formData.studentType === "SCHOOL" && (
            <p className="mt-1 text-sm text-red-600">{errors.institute}</p>
          )}
        </div>

        {/* University/Board - Auto-filled for College, Editable for School */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            University / Board <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.university || ""}
            onChange={(e) => !isNitrStudent && handleFieldChange("university", e.target.value)}
            onBlur={handleUniversityBlur}
            placeholder={
              formData.studentType === "SCHOOL"
                ? "Enter your board (CBSE, ICSE, State Board, etc.)"
                : "Enter your university name"
            }
            disabled={isNitrStudent}
            readOnly={isNitrStudent}
            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.university ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
            } ${isNitrStudent ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city || ""}
            onChange={(e) => !isNitrStudent && handleFieldChange("city", e.target.value)}
            placeholder="Enter your city"
            disabled={isNitrStudent}
            readOnly={isNitrStudent}
            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.city ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
            } ${isNitrStudent ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.state || ""}
            onChange={(e) => !isNitrStudent && handleFieldChange("state", e.target.value)}
            placeholder="Enter your state"
            disabled={isNitrStudent}
            readOnly={isNitrStudent}
            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.state ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
            } ${isNitrStudent ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
        </div>

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
  );
}
