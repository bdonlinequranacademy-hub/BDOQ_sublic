"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { BilingualLabel } from "@/components/forms/shared/BilingualLabel";
import { FileDropzone } from "@/components/forms/shared/FileDropzone";
import {
  formErrorClass,
  formInputClass,
} from "@/components/forms/shared/formStyles";
import { PACKAGES } from "@/lib/constants";
import { usePaymentSelectOptions } from "@/lib/i18n/useFormSelectOptions";
import type { StudentAdmissionFormValues } from "@/lib/validators/studentAdmission";
import { cn } from "@/lib/cn";

function monthlyTuitionForPlan(
  plan: string | undefined,
  currency: "bdt" | "usd"
): number {
  const match = PACKAGES.find(
    (pkg) => pkg.name.toLowerCase() === (plan ?? "").toLowerCase()
  );
  if (!match) return currency === "usd" ? 35 : 3000;
  return match.price[currency];
}

export function StudentStepMonthlyTuition() {
  const t = useTranslations("forms.studentAdmission.monthlyTuition");
  const paymentOptions = usePaymentSelectOptions();
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<StudentAdmissionFormValues>();

  const choice = useWatch({ control, name: "monthlyTuitionChoice" });
  const currency = useWatch({ control, name: "admissionFeeCurrency" }) ?? "bdt";
  const packagePlan = useWatch({ control, name: "packagePlan" });
  const admissionMethod = useWatch({
    control,
    name: "admissionFeePaymentMethod",
  });

  const monthlyExpected = monthlyTuitionForPlan(
    packagePlan,
    currency === "usd" ? "usd" : "bdt"
  );
  const monthlyLabel =
    currency === "usd" ? `$${monthlyExpected} USD` : `৳${monthlyExpected} BDT`;

  useEffect(() => {
    if (choice !== "yes") return;
    setValue("monthlyTuitionAmount", String(monthlyExpected), {
      shouldValidate: true,
    });
    if (admissionMethod) {
      setValue("monthlyTuitionPaymentMethod", admissionMethod, {
        shouldValidate: false,
      });
    }
  }, [admissionMethod, choice, monthlyExpected, setValue]);

  const selectChoice = (next: "yes" | "no"): void => {
    setValue("monthlyTuitionChoice", next, { shouldValidate: true });
    setValue("payCurrentMonthTuition", next === "yes", { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <p className="font-body text-base leading-relaxed text-text-dark">
          {t("intro")}
        </p>
        <p className="mt-3 font-inter text-lg font-semibold text-primary-dark">
          {t("packageAmount")}: {monthlyLabel}
        </p>
        <p className="mt-2 font-body text-sm text-text-gray">{t("hint")}</p>
      </div>

      <div>
        <p className="mb-3 font-body text-sm font-semibold text-primary-dark">
          {t("question")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectChoice("yes")}
            className={cn(
              "min-h-[88px] rounded-2xl border-2 px-4 py-4 text-left transition",
              choice === "yes"
                ? "border-primary bg-primary/10 shadow-md"
                : "border-gray-200 bg-white hover:border-primary/40"
            )}
          >
            <span className="block font-inter text-lg font-bold text-primary-dark">
              {t("yesTitle")}
            </span>
            <span className="mt-1 block font-body text-sm text-text-gray">
              {t("yesBody")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => selectChoice("no")}
            className={cn(
              "min-h-[88px] rounded-2xl border-2 px-4 py-4 text-left transition",
              choice === "no"
                ? "border-primary bg-primary/10 shadow-md"
                : "border-gray-200 bg-white hover:border-primary/40"
            )}
          >
            <span className="block font-inter text-lg font-bold text-primary-dark">
              {t("noTitle")}
            </span>
            <span className="mt-1 block font-body text-sm text-text-gray">
              {t("noBody")}
            </span>
          </button>
        </div>
        {errors.monthlyTuitionChoice && (
          <p className={formErrorClass}>{errors.monthlyTuitionChoice.message}</p>
        )}
      </div>

      {choice === "yes" ? (
        <div className="space-y-5 rounded-2xl border border-teal-200 bg-white p-5">
          <p className="font-body text-sm font-semibold text-primary-dark">
            {t("detailsTitle")}
          </p>

          <div>
            <BilingualLabel
              htmlFor="monthlyTuitionAmount"
              labelBn="চলতি মাসের টিউশন"
              labelEn="This month’s tuition amount"
              required
            />
            <input
              id="monthlyTuitionAmount"
              type="number"
              min={1}
              step="0.01"
              className={formInputClass}
              {...register("monthlyTuitionAmount")}
            />
            {errors.monthlyTuitionAmount && (
              <p className={formErrorClass}>
                {errors.monthlyTuitionAmount.message}
              </p>
            )}
          </div>

          <div>
            <BilingualLabel
              htmlFor="monthlyTuitionPaymentMethod"
              labelBn="পেমেন্ট পদ্ধতি"
              labelEn="How did you pay this month’s tuition?"
              required
            />
            <select
              id="monthlyTuitionPaymentMethod"
              className={formInputClass}
              {...register("monthlyTuitionPaymentMethod")}
            >
              <option value="">{t("selectMethod")}</option>
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.monthlyTuitionPaymentMethod && (
              <p className={formErrorClass}>
                {errors.monthlyTuitionPaymentMethod.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <BilingualLabel
                htmlFor="monthlyTuitionReference"
                labelBn="ট্রানজেকশন / রেফারেন্স নম্বর"
                labelEn="Transaction / reference number"
                required
              />
              <input
                id="monthlyTuitionReference"
                type="text"
                className={formInputClass}
                placeholder={t("referencePlaceholder")}
                {...register("monthlyTuitionReference")}
              />
              {errors.monthlyTuitionReference && (
                <p className={formErrorClass}>
                  {errors.monthlyTuitionReference.message}
                </p>
              )}
            </div>
            <div>
              <BilingualLabel
                htmlFor="monthlyTuitionDate"
                labelBn="পেমেন্টের তারিখ"
                labelEn="Payment date"
                required
              />
              <input
                id="monthlyTuitionDate"
                type="date"
                className={formInputClass}
                {...register("monthlyTuitionDate")}
              />
              {errors.monthlyTuitionDate && (
                <p className={formErrorClass}>
                  {errors.monthlyTuitionDate.message}
                </p>
              )}
            </div>
          </div>

          <Controller
            name="monthlyTuitionProofFile"
            control={control}
            render={({ field }) => (
              <FileDropzone
                id="monthlyTuitionProofFile"
                label={t("proofLabel")}
                kind="image"
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.monthlyTuitionProofFile?.message}
              />
            )}
          />
          <p className="font-body text-xs text-text-gray">{t("proofHint")}</p>
        </div>
      ) : null}
    </div>
  );
}
