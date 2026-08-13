export const OPTIONAL_PAYMENT_CATEGORIES = [
  "teacher_bakhshish",
  "eid_gift",
  "sponsor_student",
  "sadaqah",
  "custom",
] as const;

export type OptionalPaymentCategoryType =
  (typeof OPTIONAL_PAYMENT_CATEGORIES)[number];

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
  bkash: { label: "bKash (Send Money)", number: "01923497460" },
  nagad: { label: "Nagad", number: "01923497460" },
  rocket: { label: "Rocket", number: "01923497460" },
  bank: {
    label: "Bank transfer",
    accountName: "BD Online Quran Academy",
    note: "Contact us on WhatsApp for bank account details before transfer.",
  },
} as const;

export const PUBLIC_PAYMENT_CARDS = [
  {
    id: "admission_fee",
    href: "/student-admission",
    kind: "link",
  },
  {
    id: "monthly_tuition",
    href: "/payments#monthly-tuition",
    kind: "portal",
  },
  {
    id: "teacher_bakhshish",
    href: "/payments?category=teacher_bakhshish#pay-form",
    kind: "form",
  },
  {
    id: "eid_gift",
    href: "/payments?category=eid_gift#pay-form",
    kind: "form",
  },
  {
    id: "sponsor_student",
    href: "/payments?category=sponsor_student#pay-form",
    kind: "form",
  },
  {
    id: "sadaqah",
    href: "/payments?category=sadaqah#pay-form",
    kind: "form",
  },
  {
    id: "custom",
    href: "/payments?category=custom#pay-form",
    kind: "form",
  },
] as const;
