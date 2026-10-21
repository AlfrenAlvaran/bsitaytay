"use client";

import { FieldError } from "@/features/auth/components/UploadField";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";


interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  autoComplete?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select",
  autoComplete,
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <label
            htmlFor={name}
            className="mb-1.5 block text-[13px] font-medium text-slate-700"
          >
            {label}
          </label>
          <select
            {...field}
            id={name}
            value={field.value ?? ""}
            autoComplete={autoComplete}
            aria-invalid={!!fieldState.error}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
          >
            <option value="">{placeholder}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldError message={fieldState.error?.message ?? ""} />
        </div>
      )}
    />
  );
}