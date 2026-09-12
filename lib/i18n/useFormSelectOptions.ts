"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  NATIONALITY_OPTIONS,
  PACKAGE_OPTIONS,
  PAYMENT_OPTIONS,
} from "@/lib/formOptions";
import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";

type PackageKey = "basic" | "standard" | "advance" | "premium";
type PaymentKey = "bkash" | "nagad" | "bank" | "cash";
type NationalityKey = (typeof NATIONALITY_OPTIONS)[number];

export function useNationalitySelectOptions(): {
  value: NationalityKey;
  label: string;
}[] {
  const t = useTranslations("forms.options.nationality");

  return useMemo(
    () =>
      NATIONALITY_OPTIONS.map((value) => ({
        value,
        label: t(value),
      })),
    [t]
  );
}

export function usePackageSelectOptions(): {
  value: string;
  label: string;
}[] {
  const t = useTranslations("forms.options.package");
  const [dynamicOptions, setDynamicOptions] = useState<
    { value: string; label: string }[] | null
  >(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<{ data?: { packages?: any[] } }>(
          "/public/pricing"
        );
        const pkgs = res.data?.packages || [];
        const valid = pkgs.filter((p) => p.name && p.price?.bdt > 0);
        if (valid.length > 0) {
          setDynamicOptions(
            valid.map((p) => ({
              value: p.slug || p.name.toLowerCase().replace(/\s+/g, "-"),
              label: `${p.name} — ৳${p.price.bdt}/${p.period || "Monthly"}`,
            }))
          );
        } else {
          setDynamicOptions([]);
        }
      } catch {
        setDynamicOptions([]);
      }
    }
    load();
  }, []);

  const defaultOptions = useMemo(
    () =>
      PACKAGE_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.value as PackageKey) || option.label,
      })),
    [t]
  );

  return dynamicOptions && dynamicOptions.length > 0
    ? dynamicOptions
    : defaultOptions;
}

export function usePaymentSelectOptions(): {
  value: PaymentKey;
  label: string;
}[] {
  const t = useTranslations("forms.options.payment");

  return useMemo(
    () =>
      PAYMENT_OPTIONS.map((option) => ({
        value: option.value as PaymentKey,
        label: t(option.value as PaymentKey),
      })),
    [t]
  );
}
