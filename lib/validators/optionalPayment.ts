import { z } from "zod";
import {
  OPTIONAL_PAYMENT_CATEGORIES,
  OPTIONAL_PAYMENT_CURRENCIES,
  OPTIONAL_PAYMENT_METHODS,
} from "@/lib/optionalPayments";
import type { FormValidationFn } from "@/lib/validators/freeClass";

export function createOptionalPaymentSchema(v: FormValidationFn) {
  return z
    .object({
      category: z.enum(OPTIONAL_PAYMENT_CATEGORIES, {
        message: v("optionalPaymentCategoryRequired"),
      }),
      customLabel: z.string().optional(),
      amount: z
        .string()
        .min(1, v("optionalPaymentAmountRequired"))
        .refine((value) => {
          const amount = Number(value);
          return Number.isFinite(amount) && amount >= 1;
        }, v("optionalPaymentAmountInvalid")),
      currency: z.enum(OPTIONAL_PAYMENT_CURRENCIES),
      method: z.enum(OPTIONAL_PAYMENT_METHODS, {
        message: v("optionalPaymentMethodRequired"),
      }),
      payerName: z.string().min(2, v("contactNameRequired")),
      email: z.string().optional(),
      whatsapp: z.string().optional(),
      reference: z.string().min(3, v("optionalPaymentReferenceRequired")),
      paymentDate: z.string().min(1, v("optionalPaymentDateRequired")),
      note: z.string().optional(),
      screenshot: z.custom<File | null>(),
    })
    .superRefine((data, ctx) => {
      if (data.category === "custom" && !(data.customLabel ?? "").trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["customLabel"],
          message: v("optionalPaymentCustomLabelRequired"),
        });
      }

      const email = (data.email ?? "").trim();
      const whatsapp = (data.whatsapp ?? "").trim();
      if (!email && !whatsapp) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: v("optionalPaymentContactRequired"),
        });
      } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: v("emailInvalid"),
        });
      }

      if (!(data.screenshot instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["screenshot"],
          message: v("optionalPaymentScreenshotRequired"),
        });
      }
    });
}

export type OptionalPaymentFormValues = z.infer<
  ReturnType<typeof createOptionalPaymentSchema>
>;
