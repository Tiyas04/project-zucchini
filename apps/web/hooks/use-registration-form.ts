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
  onComplete: (isNitrStudent: boolean, wantsAccommodation: boolean, referralCode?: string) => void;
}

export function useRegistrationForm({ user, onComplete }: UseRegistrationFormProps) {
  const [isNitrStudent, setIsNitrStudent] = useState(false);
  const [wantsAccommodation, setWantsAccommodation] = useState(false);

  const { formData, errors, handleInputChange, validateForm, setFormData, setErrors } =
    useFormState<Registration>(
      {
        email: user.email || "",
        name: user.displayName || "",
        gender: undefined,
        // Use dummy URLs for permission and undertaking to pass validation (fields are commented out in form)
        // Not removed from db as might be required in future
        permission: "https://some-website.com/permission",
        undertaking: "https://some-website.com/undertaking",
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
      }));
    }
    // Clear any validation errors for permission and undertaking (always using dummy values)
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.permission;
      delete newErrors.undertaking;
      return newErrors;
    });
  }, [isNitrStudent, setFormData, setErrors]);

  const {
    loading: isSubmitting,
    error: submitError,
    execute: registerApi,
  } = useApi<{ userId: number; referralCode: string }>({
    onSuccess: (data) => {
      toast.success("Registration successful!", {
        description: isNitrStudent
          ? "Your registration is complete. No payment required for NIT Rourkela students."
          : "Please proceed to payment to complete your registration.",
      });
      onComplete(isNitrStudent, wantsAccommodation, data?.referralCode);
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
        referralCode: formData.referralCode || undefined,
        isNitrStudent,
        wantsAccommodation: isNitrStudent ? false : wantsAccommodation,
      }),
    });
  };

  return {
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
  };
}
