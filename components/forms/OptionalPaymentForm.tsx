"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { API_BASE } from "@/lib/constants";
import { useFormValidation } from "@/lib/i18n/useFormValidation";
import {
  OPTIONAL_PAYMENT_ACCOUNTS,
  OPTIONAL_PAYMENT_CATEGORIES,
  OPTIONAL_PAYMENT_METHODS,
  type OptionalPaymentCategoryType,
} from "@/lib/optionalPayments";
import {
  createOptionalPaymentSchema,
  type OptionalPaymentFormValues,
} from "@/lib/validators/optionalPayment";
import { FileDropzone } from "@/components/forms/shared/FileDropzone";
import { FormAlert } from "@/components/forms/shared/FormAlert";
import { SubmitButton } from "@/components/forms/shared/SubmitButton";
import {
  formErrorClass,
  formInputClass,
  formLabelClass,
  formTextareaClass,
} from "@/components/forms/shared/formStyles";
import { cn } from "@/lib/cn";

function isOptionalCategory(value: string | null): value is OptionalPaymentCategoryType {
  return Boolean(
    value &&
      (OPTIONAL_PAYMENT_CATEGORIES as readonly string[]).includes(value)
  );
}

export function OptionalPaymentForm() {
  const locale = useLocale();
  const t = useTranslations("pages.payments");
  const validate = useFormValidation();
  const searchParams = useSearchParams();
  const schema = useMemo(
    () => createOptionalPaymentSchema(validate),
    [validate, locale]
  );

  const requestedCategory = searchParams.get("category");
  const defaultCategory = isOptionalCategory(requestedCategory)
    ? requestedCategory
    : "sadaqah";

  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OptionalPaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: defaultCategory,
      customLabel: "",
      amount: "",
      currency: "bdt",
      method: "bkash",
      payerName: "",
      email: "",
      whatsapp: "",
      reference: "",
      paymentDate: "",
      note: "",
      screenshot: null,
    },
  });

  useEffect(() => {
    if (isOptionalCategory(requestedCategory)) {
      setValue("category", requestedCategory, { shouldValidate: true });
    }
  }, [requestedCategory, setValue]);

  const method = useWatch({ control, name: "method" });
  const category = useWatch({ control, name: "category" });

  const instructionLines = useMemo(() => {
    if (method === "bank") {
      return [
        t("instructions.bankIntro", {
          name: OPTIONAL_PAYMENT_ACCOUNTS.bank.accountName,
        }),
        OPTIONAL_PAYMENT_ACCOUNTS.bank.note,
        t("instructions.referenceHint"),
      ];
    }

    const account = OPTIONAL_PAYMENT_ACCOUNTS[method];
    if (!account || !("number" in account)) return [];
    return [
      t("instructions.sendTo", {
        method: account.label,
        account: account.number,
      }),
      t("instructions.referenceHint"),
    ];
  }, [method, t]);

  const onSubmit = async (data: OptionalPaymentFormValues): Promise<void> => {
    if (!(data.screenshot instanceof File)) return;
    setSubmitState("loading");
    try {
      const formData = new FormData();
      formData.append("category", data.category);
      if (data.customLabel) formData.append("customLabel", data.customLabel);
      formData.append("amount", data.amount);
      formData.append("currency", data.currency === "usd" ? "USD" : "BDT");
      formData.append("method", data.method);
      formData.append("payerName", data.payerName);
      if (data.email) formData.append("email", data.email);
      if (data.whatsapp) formData.append("whatsapp", data.whatsapp);
      formData.append("reference", data.reference);
      formData.append("paymentDate", data.paymentDate);
      if (data.note) formData.append("note", data.note);
      formData.append("locale", locale);
      formData.append("screenshot", data.screenshot);

      const response = await fetch(`${API_BASE}/public/optional-payments`, {
        method: "POST",
        body: formData,
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed");
      setSubmitState("success");
      reset({
        category: data.category,
        customLabel: "",
        amount: "",
        currency: data.currency,
        method: data.method,
        payerName: "",
        email: "",
        whatsapp: "",
        reference: "",
        paymentDate: "",
        note: "",
        screenshot: null,
      });
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <div
      id="pay-form"
      className="mt-14 scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7"
    >
      <h2 className="font-playfair text-2xl font-bold text-primary-dark">
        {t("formTitle")}
      </h2>
      <p className="mt-1 font-body text-sm text-text-gray">{t("formHint")}</p>
      <p className="mt-3 font-body text-xs text-text-gray">{t("monthlyHint")}</p>

      {submitState === "success" && (
        <FormAlert type="success" message={t("success")} className="mt-5" />
      )}
      {submitState === "error" && (
        <FormAlert type="error" message={t("error")} className="mt-5" />
      )}

      {instructionLines.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4">
          <ul className="space-y-1 font-body text-sm text-text-dark">
            {instructionLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label htmlFor="optional-category" className={formLabelClass}>
            {t("category")}
          </label>
          <select
            id="optional-category"
            className={formInputClass}
            {...register("category")}
          >
            {OPTIONAL_PAYMENT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {t(`cards.${item}.title`)}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className={formErrorClass}>{errors.category.message}</p>
          ) : null}
        </div>

        {category === "custom" ? (
          <div className="sm:col-span-2">
            <label htmlFor="optional-custom-label" className={formLabelClass}>
              {t("customLabel")}
            </label>
            <input
              id="optional-custom-label"
              className={formInputClass}
              placeholder={t("customLabelPlaceholder")}
              {...register("customLabel")}
            />
            {errors.customLabel ? (
              <p className={formErrorClass}>{errors.customLabel.message}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label htmlFor="optional-name" className={formLabelClass}>
            {t("payerName")}
          </label>
          <input
            id="optional-name"
            className={formInputClass}
            placeholder={t("payerNamePlaceholder")}
            {...register("payerName")}
          />
          {errors.payerName ? (
            <p className={formErrorClass}>{errors.payerName.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="optional-email" className={formLabelClass}>
            {t("email")}
          </label>
          <input
            id="optional-email"
            type="email"
            className={formInputClass}
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className={formErrorClass}>{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="optional-whatsapp" className={formLabelClass}>
            {t("whatsapp")}
          </label>
          <input
            id="optional-whatsapp"
            className={formInputClass}
            placeholder={t("whatsappPlaceholder")}
            {...register("whatsapp")}
          />
          {errors.whatsapp ? (
            <p className={formErrorClass}>{errors.whatsapp.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="optional-method" className={formLabelClass}>
            {t("method")}
          </label>
          <select
            id="optional-method"
            className={formInputClass}
            {...register("method")}
          >
            {OPTIONAL_PAYMENT_METHODS.map((item) => (
              <option key={item} value={item}>
                {t(`methods.${item}`)}
              </option>
            ))}
          </select>
          {errors.method ? (
            <p className={formErrorClass}>{errors.method.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="optional-amount" className={formLabelClass}>
            {t("amount")}
          </label>
          <input
            id="optional-amount"
            type="number"
            min="1"
            step="0.01"
            className={formInputClass}
            {...register("amount")}
          />
          {errors.amount ? (
            <p className={formErrorClass}>{errors.amount.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="optional-currency" className={formLabelClass}>
            {t("currency")}
          </label>
          <select
            id="optional-currency"
            className={formInputClass}
            {...register("currency")}
          >
            <option value="bdt">{t("currencyBdt")}</option>
            <option value="usd">{t("currencyUsd")}</option>
          </select>
        </div>

        <div>
          <label htmlFor="optional-reference" className={formLabelClass}>
            {t("reference")}
          </label>
          <input
            id="optional-reference"
            className={formInputClass}
            placeholder={t("referencePlaceholder")}
            {...register("reference")}
          />
          {errors.reference ? (
            <p className={formErrorClass}>{errors.reference.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="optional-date" className={formLabelClass}>
            {t("paymentDate")}
          </label>
          <input
            id="optional-date"
            type="date"
            className={formInputClass}
            {...register("paymentDate")}
          />
          {errors.paymentDate ? (
            <p className={formErrorClass}>{errors.paymentDate.message}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="optional-note" className={formLabelClass}>
            {t("note")}
          </label>
          <textarea
            id="optional-note"
            className={cn(formTextareaClass, "min-h-[100px]")}
            placeholder={t("notePlaceholder")}
            {...register("note")}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="screenshot"
            control={control}
            render={({ field }) => (
              <FileDropzone
                id="optional-screenshot"
                label={t("screenshot")}
                kind="image"
                value={field.value instanceof File ? field.value : null}
                onChange={field.onChange}
                error={errors.screenshot?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <SubmitButton
            type="submit"
            isLoading={submitState === "loading"}
            label={t("submit")}
          />
        </div>
      </form>
    </div>
  );
}
