import type { MunRegistration } from "@repo/shared-types";
import { munDetailsFields } from "../../../config/register/mun";
import { renderFormFields } from "../../../utils/form";

interface MunDetailsSectionProps {
  formData: Partial<MunRegistration>;
  errors: Record<string, string>;
  handleFieldChange: (field: keyof MunRegistration, value: any) => void;
}

export function MunDetailsSection({ formData, errors, handleFieldChange }: MunDetailsSectionProps) {
  return (
    <div className="space-y-4">
      {munDetailsFields.map((field) => {
        // Filter committee options based on student type
        let filteredField = field;
        if (
          field.name === "committeeChoice" &&
          formData.studentType === "SCHOOL" &&
          "options" in field
        ) {
          filteredField = {
            ...field,
            options: field.options.filter((opt) => opt.schoolAllowed !== false),
          };
        }

        return (
          <div key={field.name}>
            {renderFormFields([filteredField], formData, errors, handleFieldChange)}
            {field.name === "committeeChoice" && formData.studentType === "SCHOOL" && (
              <p className="mt-1 text-sm text-amber-600">
                Note: School students can only participate in UNHRC, DISEC, AIPPM, ECOSOC, and IP
                committees
              </p>
            )}
            {formData.committeeChoice === "MOOT_COURT" && (
              <p className="mt-1 text-sm text-blue-600">
                Note: For MOOT Court, you will register as team leader and provide details of 2
                teammates (2 speakers + 1 researcher)
              </p>
            )}
          </div>
        );
      })}

      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hasParticipatedBefore || false}
            onChange={(e) => handleFieldChange("hasParticipatedBefore", e.target.checked)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
          />
          <span className="ml-2 text-sm text-white">I have participated in NITRUTSAV before</span>
        </label>
      </div>
    </div>
  );
}
