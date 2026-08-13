"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { formInputClass } from "@/components/forms/shared/formStyles";
import { cn } from "@/lib/cn";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function PasswordInput({ className, id, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("forms.common");

  return (
    <div className="relative">
      <input
        id={id}
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn(formInputClass, "pr-12", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-text-gray transition hover:bg-bg-light hover:text-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={visible ? t("hidePassword") : t("showPassword")}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
});
