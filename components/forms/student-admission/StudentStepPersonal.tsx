"use client";

import { useMemo } from "react";
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
import { useNationalitySelectOptions } from "@/lib/i18n/useFormSelectOptions";
import type { StudentAdmissionFormValues } from "@/lib/validators/studentAdmission";

export function StudentStepPersonal() {
  const t = useTranslations("forms.studentAdmission");
  const tGender = useTranslations("forms.options.gender");
  const nationalityOptions = useNationalitySelectOptions();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<StudentAdmissionFormValues>();

  const genderOptions = useMemo(
    () => [
      {
        value: "male",
        labelBn: tGender("maleBoy"),
        labelEn: tGender("maleBoy"),
      },
      {
        value: "female",
        labelBn: tGender("femaleGirl"),
        labelEn: tGender("femaleGirl"),
      },
    ],
    [tGender]
  );

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
            htmlFor="dateOfBirth"
            labelBn="জন্ম তারিখ"
            labelEn="Date of Birth"
            required
          />
          <input
            id="dateOfBirth"
            type="date"
            className={formInputClass}
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && (
            <p className={formErrorClass}>{errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <BilingualLabel
            htmlFor="nationality"
            labelBn="জাতীয়তা"
            labelEn="Nationality"
            required
          />
          <select
            id="nationality"
            className={formInputClass}
            {...register("nationality")}
          >
            <option value="">{t("placeholders.nationality")}</option>
            {nationalityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.nationality && (
            <p className={formErrorClass}>{errors.nationality.message}</p>
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

      <div>
        <BilingualLabel labelBn="লিঙ্গ" labelEn="Gender" required />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FormSelect
              id="gender"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.gender?.message}
              options={genderOptions}
            />
          )}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="min-w-0">
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
        <div className="min-w-0">
          <BilingualLabel
            htmlFor="guardianWhatsapp"
            labelBn="অভিভাবকের WhatsApp"
            labelEn="Guardian WhatsApp"
          />
          <Controller
            name="guardianWhatsapp"
            control={control}
            render={({ field }) => (
              <PhoneInput
                id="guardianWhatsapp"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
