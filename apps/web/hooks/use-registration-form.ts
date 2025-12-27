"use client";

import { useState, useEffect } from "react";
import { type User } from "@repo/firebase-config";
import { RegistrationSchema, type Registration } from "@repo/shared-types";
import { useApi } from "@repo/shared-utils";
import { useFormState } from "@/utils/form";
import { NITR_INSTITUTE_NAME, NITR_UNIVERSITY_NAME, isNitRourkela } from "@/config/register";
import { collegeOptions } from "@/config/register/colleges";
import { toast } from "sonner";

interface UseRegistrationFormProps {
  user: User;
  onComplete: (isNitrStudent: boolean) => void;
}

export function useRegistrationForm({ user, onComplete }: UseRegistrationFormProps) {
  const [isNitrStudent, setIsNitrStudent] = useState(false);

  const { formData, errors, handleInputChange, validateForm, setFormData, setErrors } =
    useFormState<Registration>(
      {
        email: user.email || "",
        name: user.displayName || "",
        gender: undefined,
        permission: undefined as any,
        undertaking: undefined as any,
      },
      RegistrationSchema
    );

  // Auto-fill NITR student fields
  useEffect(() => {
    if (isNitrStudent) {
      setFormData((prev) => ({
        ...prev,
        institute: NITR_INSTITUTE_NAME,
        university: NITR_UNIVERSITY_NAME,
        // Set dummy URLs for permission and undertaking to pass validation
        permission: "https://nitr.ac.in/permission",
        undertaking: "https://nitr.ac.in/undertaking",
      }));
      // Clear any validation errors for these fields
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.permission;
        delete newErrors.undertaking;
        return newErrors;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        permission: undefined as any,
        undertaking: undefined as any,
      }));
    }
  }, [isNitrStudent, setFormData, setErrors]);

  const {
    loading: isSubmitting,
    error: submitError,
    execute: registerApi,
  } = useApi<{ userId: number }>({
    onSuccess: () => {
      toast.success("Registration successful!", {
        description: isNitrStudent
          ? "Your registration is complete. No payment required for NIT Rourkela students."
          : "Please proceed to payment to complete your registration.",
      });
      onComplete(isNitrStudent);
    },
    onError: (error) => {
      toast.error("Registration failed", {
        description: error,
      });
    },
  });

  const handleInstituteChange = (value: string) => {
    const selectedCollege = collegeOptions.find((c) => c.value === value);

    // Check if NIT Rourkela is selected using comprehensive detection
    if (isNitRourkela(value)) {
      setIsNitrStudent(true);
    }

    if (selectedCollege) {
      handleInputChange("institute", selectedCollege.value);
      handleInputChange("university", selectedCollege.value);
    } else {
      handleInputChange("institute", value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For NITR students, skip validation of permission and undertaking
    if (!isNitrStudent && !validateForm()) {
      return;
    }

    // For NITR students, validate only the fields that are shown
    if (isNitrStudent) {
      const fieldsToValidate = [
        "name",
        "email",
        "phone",
        "institute",
        "university",
        "idCard",
        "rollNumber",
        "gender",
      ];
      const hasErrors = Object.keys(errors).some(
        (key) => fieldsToValidate.includes(key) && errors[key as keyof typeof errors]
      );

      if (
        hasErrors ||
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.institute ||
        !formData.university ||
        !formData.idCard ||
        !formData.rollNumber ||
        !formData.gender
      ) {
        return;
      }
    }

    await registerApi("register", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        isNitrStudent,
      }),
    });
  };

  return {
    formData,
    errors,
    isNitrStudent,
    isSubmitting,
    submitError,
    setIsNitrStudent,
    handleInputChange,
    handleInstituteChange,
    handleSubmit,
  };
}
