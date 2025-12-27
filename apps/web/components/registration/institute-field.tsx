import SearchableSelect from "../ui/searchable-select";
import { collegeOptions, OTHER_COLLEGE_VALUE } from "@/config/register/colleges";

interface InstituteFieldProps {
  value: string | undefined;
  universityValue: string | undefined;
  isNitrStudent: boolean;
  instituteError?: string;
  universityError?: string;
  onInstituteChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
}

export default function InstituteField({
  value,
  universityValue,
  isNitrStudent,
  instituteError,
  universityError,
  onInstituteChange,
  onUniversityChange,
}: InstituteFieldProps) {
  return (
    <>
      {/* Institute Name - Searchable Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Institute Name <span className="text-red-500">*</span>
        </label>
        {isNitrStudent ? (
          <input
            type="text"
            value={value || ""}
            disabled
            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl opacity-50 cursor-not-allowed"
          />
        ) : (
          <SearchableSelect
            options={[
              ...collegeOptions.map((c) => ({ label: c.label, value: c.value })),
              { label: "Other (Enter manually)", value: OTHER_COLLEGE_VALUE },
            ]}
            value={value}
            onChange={onInstituteChange}
            placeholder="Search for your college..."
            error={instituteError}
            allowCustom={true}
            customPlaceholder="Enter your college/institute name..."
          />
        )}
      </div>

      {/* University Name - Auto-filled or manual */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          University Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={universityValue || ""}
          onChange={(e) => onUniversityChange(e.target.value)}
          placeholder="Enter your university name"
          disabled={isNitrStudent}
          className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            universityError ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
          } ${isNitrStudent ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {universityError && <p className="mt-1 text-sm text-red-600">{universityError}</p>}
      </div>
    </>
  );
}
