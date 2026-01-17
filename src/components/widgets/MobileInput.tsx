"use client";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RequiredIndicator from "./RequiredIndicator";
import ValidationMessage from "./ValidationMessage";

interface MobileInputProps {
  label?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
}

const MobileInput = ({
  label = "Mobile Number",
  register,
  error,
  disabled,
  placeholder = "9876543210",
}: MobileInputProps) => {
  return (
    <div className="space-y-1">
      <div className="space-y-2">
        <Label>
          {label} <RequiredIndicator />
        </Label>
        <Input
          type="tel"
          {...register}
          disabled={disabled}
          placeholder={placeholder}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value
              .replace(/\D/g, "")
              .slice(0, 10);
          }}
        />
      </div>
      {error?.message && <ValidationMessage message={error.message} />}
    </div>
  );
};

export default MobileInput;
