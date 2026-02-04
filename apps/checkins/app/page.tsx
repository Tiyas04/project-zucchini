"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "checkin_operator";

interface OperatorData {
  name: string;
  phone: string;
}

function validatePhone(phone: string): boolean {
  const trimmed = phone.trim();
  return /^[6-9]\d{9}$/.test(trimmed);
}

export default function LoginPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: OperatorData = JSON.parse(stored);
        if (data.name && data.phone) {
          window.location.href = "/checkin";
          return;
        }
      } catch {
        // Invalid data, continue to login
      }
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string } = {};

    const trimmedName = name.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      newErrors.name = "Name is required";
    }

    if (!trimmedPhone) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(trimmedPhone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const operatorData: OperatorData = {
      name: trimmedName,
      phone: trimmedPhone,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(operatorData));
    window.location.href = "/checkin";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl ">Check-in</CardTitle>
            <CardDescription>Enter your details to start checking in participants</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  maxLength={10}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <Button type="submit" className="w-full">
                Continue to Check-in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
