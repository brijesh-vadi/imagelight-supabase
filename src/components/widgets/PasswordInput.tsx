"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RequiredIndicator from "./RequiredIndicator";
import ValidationMessage from "./ValidationMessage";

interface PasswordInputProps {
  label?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
}

const PasswordInput = ({
  label = "Password",
  register,
  error,
  placeholder = "Min. 8 characters",
  disabled,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <div className="space-y-2">
        <Label>
          {label} <RequiredIndicator />
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register}
            placeholder={placeholder}
            className="pr-10"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="-translate-y-1/2 absolute top-1/2 right-3 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {error?.message && <ValidationMessage message={error.message} />}
    </div>
  );
};

export default PasswordInput;
