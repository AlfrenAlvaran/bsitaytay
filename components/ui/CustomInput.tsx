"use client";

import { useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Field, FieldLabel } from "./field";
import { Input } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

interface CustomInputProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
}

const CustomInput = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  maxLength,
}: CustomInputProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isSensitive = isPassword || type === "email";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="form-item">
          <FieldLabel htmlFor={field.name} className="form-label">
            {label}
          </FieldLabel>

          <div className="flex w-full flex-col">
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                maxLength={maxLength}
                autoCapitalize={isSensitive ? "none" : undefined}
                autoCorrect={isSensitive ? "off" : undefined}
                spellCheck={isSensitive ? false : undefined}
                aria-invalid={fieldState.invalid}
                className="input-class"
              />
              {isPassword && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              )}
            </div>
            {fieldState.invalid && (
              <p className="mt-1 text-sm text-red-500">
                {fieldState.error?.message}
              </p>
            )}
          </div>
        </Field>
      )}
    />
  );
};

export default CustomInput;
