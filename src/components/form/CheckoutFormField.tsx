"use client";
import type { ReactNode } from "react";

interface CheckoutFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  active?: boolean;
  error?: boolean;
  type?: string;
  placeholder?: string;
  as?: "input" | "select" | "textarea";
  rows?: number;
  children?: ReactNode;
  labelSuffix?: ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
}

const baseInputClassName =
  "peer w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-300 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";

const CheckoutFormField = ({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  readOnly,
  required,
  active,
  error,
  type = "text",
  placeholder = label,
  as = "input",
  rows = 4,
  children,
  labelSuffix,
  wrapperClassName = "relative group",
  inputClassName = "",
}: CheckoutFormFieldProps) => {
  const labelClassName = `absolute left-4 text-gray-500 text-sm transition-all duration-300 pointer-events-none ${
    active
      ? "top-2 text-xs text-zPink"
      : "top-4 text-base text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink"
  }`;

  const sharedProps = {
    id,
    name: id,
    value,
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => onChange(e.target.value),
    onFocus,
    onBlur,
    disabled,
    readOnly,
    required,
    "aria-label": label,
    "aria-required": required,
    "aria-invalid": error,
    className: `${baseInputClassName} ${inputClassName}`.trim(),
  };

  return (
    <div className={wrapperClassName}>
      {as === "textarea" ? (
        <textarea
          {...(sharedProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={rows}
          placeholder={placeholder}
        />
      ) : as === "select" ? (
        <>
          <select
            {...(sharedProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
            className={`${baseInputClassName} appearance-none cursor-pointer ${inputClassName}`.trim()}
          >
            <option value=""></option>
            {children}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </>
      ) : (
        <input
          {...(sharedProps as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
          placeholder={placeholder}
          className={`${baseInputClassName} ${inputClassName}`.trim()}
        />
      )}
      <label htmlFor={id} className={labelClassName}>
        {label} {labelSuffix}
      </label>
    </div>
  );
};

export default CheckoutFormField;
