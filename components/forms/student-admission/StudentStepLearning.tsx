"use client";

import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { BilingualLabel } from "@/components/forms/shared/BilingualLabel";
import {
  formErrorClass,
  formInputClass,
} from "@/components/forms/shared/formStyles";
import { usePackageSelectOptions } from "@/lib/i18n/useFormSelectOptions";
import {
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  DEFAULT_TIMEZONE,
} from "@/lib/formOptions";
import { TimezonePicker } from "@/components/forms/shared/TimezonePicker";
import type { StudentAdmissionFormValues } from "@/lib/validators/studentAdmission";
import { cn } from "@/lib/cn";

const CLASS_DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export function StudentStepLearning() {
  const t = useTranslations("forms.studentAdmission");
  const tCommon = useTranslations("forms.common");
  const packageOptions = usePackageSelectOptions();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<StudentAdmissionFormValues>();

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <BilingualLabel
            htmlFor="timezone"
            labelBn="সুবিধাজনক টাইম জোন"
            labelEn="Convenient time zone"
            required
          />
          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <TimezonePicker
                id="timezone"
                value={field.value ?? DEFAULT_TIMEZONE}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.timezone?.message}
              />
            )}
          />
        </div>
        <div>
          <BilingualLabel
            labelBn="পছন্দের ক্লাস সময়"
            labelEn="Preferred class time"
            required
          />
          <div className="grid grid-cols-3 gap-2">
            <select className={formInputClass} {...register("preferredHour")}>
              <option value="">{tCommon("hour")}</option>
              {HOUR_OPTIONS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <select className={formInputClass} {...register("preferredMinute")}>
              <option value="">{tCommon("minute")}</option>
              {MINUTE_OPTIONS.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
            <select className={formInputClass} {...register("preferredPeriod")}>
              <option value="AM">{tCommon("am")}</option>
              <option value="PM">{tCommon("pm")}</option>
            </select>
          </div>
          {(errors.preferredHour || errors.preferredMinute) && (
            <p className={formErrorClass}>
              {errors.preferredHour?.message ?? errors.preferredMinute?.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <BilingualLabel
          labelBn="পছন্দের ক্লাস দিন (একাধিক দিন সিলেক্ট করতে পারেন)"
          labelEn="Preferred class days (you can select multiple)"
        />
        <Controller
          name="preferredClassDays"
          control={control}
          render={({ field }) => {
            const currentDays = field.value || [];
            return (
              <div className="mt-2 flex flex-wrap gap-2">
                {CLASS_DAYS.map((day) => {
                  const active = currentDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newDays = active
                          ? currentDays.filter((d) => d !== day)
                          : [...currentDays, day];
                        field.onChange(newDays);
                      }}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                        active
                          ? "border-primary bg-primary/10 text-primary-dark"
                          : "border-gray-200 bg-white text-text-gray hover:border-primary/40"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            );
          }}
        />
      </div>

      <div>
        <BilingualLabel
          htmlFor="packagePlan"
          labelBn="প্যাকেজ"
          labelEn="Select package"
          required
        />
        <select
          id="packagePlan"
          className={formInputClass}
          {...register("packagePlan")}
        >
          <option value="">{t("placeholders.package")}</option>
          {packageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.packagePlan && (
          <p className={formErrorClass}>{errors.packagePlan.message}</p>
        )}
      </div>
    </div>
  );
}
