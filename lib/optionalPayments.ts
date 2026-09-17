export const ACADEMY_FEE_CATEGORIES = [
  "admission_fee",
  "monthly_tuition",
] as const;

export const OPTIONAL_PAYMENT_CATEGORIES = [
  "teacher_bakhshish",
  "eid_gift",
  "sponsor_student",
  "sadaqah",
  "custom",
] as const;

export const PUBLIC_PAYMENT_CATEGORIES = [
  ...ACADEMY_FEE_CATEGORIES,
  ...OPTIONAL_PAYMENT_CATEGORIES,
] as const;

export type AcademyFeeCategoryType = (typeof ACADEMY_FEE_CATEGORIES)[number];
export type OptionalPaymentCategoryType =
  (typeof OPTIONAL_PAYMENT_CATEGORIES)[number];
export type PublicPaymentCategoryType =
  (typeof PUBLIC_PAYMENT_CATEGORIES)[number];

export const OPTIONAL_PAYMENT_METHODS = [
  "bkash",
  "nagad",
  "rocket",
  "bank",
] as const;

export type OptionalPaymentMethodType =
  (typeof OPTIONAL_PAYMENT_METHODS)[number];

export const OPTIONAL_PAYMENT_CURRENCIES = ["bdt", "usd"] as const;

export type OptionalPaymentCurrencyType =
  (typeof OPTIONAL_PAYMENT_CURRENCIES)[number];

export const OPTIONAL_PAYMENT_ACCOUNTS = {
  bkash: { label: "bKash (Send Money)", number: "01923947460" },
  nagad: { label: "Nagad", number: "01923947460" },
  rocket: { label: "Rocket", number: "01923947460" },
  bank: {
    label: "Bank transfer",
    accountName: "BD Online Quran Academy",
    note: "Contact us on WhatsApp for bank account details before transfer.",
  },
} as const;

export const PUBLIC_PAYMENT_CARDS = PUBLIC_PAYMENT_CATEGORIES.map((id) => ({
  id,
  href: `/payments?category=${id}#pay-form`,
}));

export function isAcademyFeeCategory(
  value: string
): value is AcademyFeeCategoryType {
  return (ACADEMY_FEE_CATEGORIES as readonly string[]).includes(value);
}

export function isPublicPaymentCategory(
  value: string | null
): value is PublicPaymentCategoryType {
  return Boolean(
    value && (PUBLIC_PAYMENT_CATEGORIES as readonly string[]).includes(value)
  );
}
