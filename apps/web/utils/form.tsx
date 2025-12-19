import { JSX, useState } from "react";
import { z } from "zod";
import { InputField, SelectField, RadioGroup } from "../components/ui";
import { Loader2 } from "lucide-react";

/**
 * Generic form errors type
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Shared field configuration types
 */
export interface BaseInputFieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "date";
  placeholder?: string;
  required: boolean;
  maxLength?: number;
  helperText?: string;
  gridSpan?: "full" | "half";
}

export interface BaseSelectFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options: { value: string; label: string }[];
  helperText?: string;
  gridSpan?: "full" | "half";
}

export interface BaseRadioFieldConfig {
  name: string;
  label: string;
  required: boolean;
  options: { value: string; label: string }[];
  gridSpan?: "full" | "half";
}

export type FieldConfig = BaseInputFieldConfig | BaseSelectFieldConfig | BaseRadioFieldConfig;

/**
 * Hook for managing form state, validation, and error handling
 */
export function useFormState<T extends Record<string, any>>(
  initialData: Partial<T>,
  schema: z.ZodType<any, any, any>
) {
  const [formData, setFormData] = useState<Partial<T>>(initialData);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  /**
   * Handle input change and clear error for that field
   */
  const handleInputChange = (field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Validate form data against schema
   */
  const validateForm = (): boolean => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors<T> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormData,
    setErrors,
  };
}

/**
 * Render a form field based on its configuration
 */
export function renderFormField<T extends Record<string, any>>(
  field: FieldConfig,
  formData: Partial<T>,
  errors: FormErrors<T>,
  handleInputChange: (field: keyof T, value: any) => void
): JSX.Element {
  const gridClass = field.gridSpan === "full" ? "md:col-span-2" : "";

  // RadioFieldConfig: has options but no placeholder
  if ("options" in field && !("placeholder" in field)) {
    const radioField = field as BaseRadioFieldConfig;
    return (
      <RadioGroup
        key={radioField.name}
        label={radioField.label}
        name={radioField.name}
        value={(formData[radioField.name as keyof T] as string) || ""}
        onChange={(value) => handleInputChange(radioField.name as keyof T, value)}
        options={radioField.options}
        error={errors[radioField.name as keyof T]}
        required={radioField.required}
        className={gridClass}
      />
    );
  }

  // SelectFieldConfig: has options and placeholder
  if ("options" in field) {
    const selectField = field as BaseSelectFieldConfig;
    return (
      <SelectField
        key={selectField.name}
        label={selectField.label}
        name={selectField.name}
        value={(formData[selectField.name as keyof T] as string) || ""}
        onChange={(value) => handleInputChange(selectField.name as keyof T, value || undefined)}
        options={selectField.options}
        error={errors[selectField.name as keyof T]}
        placeholder={selectField.placeholder}
        required={selectField.required}
        helperText={selectField.helperText}
        className={gridClass}
      />
    );
  }

  // InputFieldConfig
  const inputField = field as BaseInputFieldConfig;
  let value = formData[inputField.name as keyof T];

  // Handle date field conversion
  if (inputField.type === "date" && value && (value as unknown) instanceof Date) {
    value = (value as Date).toISOString().split("T")[0] as any;
  }

  return (
    <InputField
      key={inputField.name}
      label={inputField.label}
      name={inputField.name}
      type={inputField.type}
      value={(value as string) || ""}
      onChange={(val) => {
        const newValue = inputField.type === "date" ? new Date(val) : val;
        handleInputChange(inputField.name as keyof T, newValue);
      }}
      error={errors[inputField.name as keyof T]}
      placeholder={inputField.placeholder}
      required={inputField.required}
      maxLength={inputField.maxLength}
      helperText={inputField.helperText}
      className={gridClass}
    />
  );
}

/**
 * Render multiple form fields from a configuration array
 */
export function renderFormFields<T extends Record<string, any>>(
  fields: FieldConfig[],
  formData: Partial<T>,
  errors: FormErrors<T>,
  handleInputChange: (field: keyof T, value: any) => void
): JSX.Element[] {
  return fields.map((field) => renderFormField(field, formData, errors, handleInputChange));
}

/**
 * Common submit button component
 */
interface SubmitButtonProps {
  isSubmitting: boolean;
  loadingText?: string;
  submitText?: string;
}

export function SubmitButton({
  isSubmitting,
  loadingText = "Submitting...",
  submitText = "Submit",
}: SubmitButtonProps) {
  return (
    <div className="flex justify-end pt-4">
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {loadingText}
          </>
        ) : (
          submitText
        )}
      </button>
    </div>
  );
}

/**
 * Error display component
 */
interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>;
}
