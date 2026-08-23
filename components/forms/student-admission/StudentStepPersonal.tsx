"use client";

import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { BilingualLabel } from "@/components/forms/shared/BilingualLabel";
import { PasswordInput } from "@/components/forms/shared/PasswordInput";
import { PhoneInput } from "@/components/forms/shared/PhoneInput";
import { FormSelect } from "@/components/forms/shared/FormSelect";
import {
  formErrorClass,
  formInputClass,
} from "@/components/forms/shared/formStyles";
import { COUNTRY_OPTIONS } from "@/lib/formOptions";
import type { StudentAdmissionFormValues } from "@/lib/validators/studentAdmission";

export function StudentStepPersonal() {
  const t = useTranslations("forms.studentAdmission");
  const countryOptions = COUNTRY_OPTIONS.map((c) => ({
    value: c,
    labelBn: c,
    labelEn: c,
  }));
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<StudentAdmissionFormValues>();

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <BilingualLabel
            htmlFor="fullName"
            labelBn="সম্পূর্ণ নাম"
            labelEn="Full Name"
            required
          />
          <input
            id="fullName"
            className={formInputClass}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className={formErrorClass}>{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <BilingualLabel
            htmlFor="email"
            labelBn="ইমেইল"
            labelEn="Email"
            required
          />
          <input
            id="email"
            type="email"
            className={formInputClass}
            {...register("email")}
          />
          {errors.email && (
            <p className={formErrorClass}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <BilingualLabel
            htmlFor="whatsapp"
            labelBn="WhatsApp নম্বর"
            labelEn="Mobile (WhatsApp)"
            required
          />
          <Controller
            name="whatsapp"
            control={control}
            render={({ field }) => (
              <PhoneInput
                id="whatsapp"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.whatsapp && (
            <p className={formErrorClass}>{errors.whatsapp.message}</p>
          )}
        </div>
        <div>
          <BilingualLabel
            htmlFor="country"
            labelBn="দেশ"
            labelEn="Country"
            required
          />
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormSelect
                id="country"
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.country?.message}
                options={countryOptions}
              />
            )}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <BilingualLabel
            htmlFor="password"
            labelBn="পাসওয়ার্ড"
            labelEn="Password"
            required
          />
          <PasswordInput
            id="password"
            autoComplete="new-password"
            {...register("password")}
          />
          <p className="mt-1 font-body text-xs text-text-gray">
            অনুমোদনের পর এই পাসওয়ার্ড দিয়ে পোর্টালে লগইন করবেন। / You will use
            this password to sign in after approval.
          </p>
          {errors.password && (
            <p className={formErrorClass}>{errors.password.message}</p>
          )}
        </div>
        <div>
          <BilingualLabel
            htmlFor="confirmPassword"
            labelBn="পাসওয়ার্ড নিশ্চিত করুন"
            labelEn="Confirm password"
            required
          />
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className={formErrorClass}>{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
