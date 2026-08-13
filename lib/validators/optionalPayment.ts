import { z } from "zod";
import {
  OPTIONAL_PAYMENT_CURRENCIES,
  OPTIONAL_PAYMENT_METHODS,
  PUBLIC_PAYMENT_CATEGORIES,
  isAcademyFeeCategory,
} from "@/lib/optionalPayments";
import type { FormValidationFn } from "@/lib/validators/freeClass";

export function createOptionalPaymentSchema(v: FormValidationFn) {
  return z
    .object({
      category: z.enum(PUBLIC_PAYMENT_CATEGORIES, {
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

      if (isAcademyFeeCategory(data.category)) {
        const digits = (data.whatsapp ?? "").replace(/\D/g, "");
        if (digits.length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["whatsapp"],
            message: v("optionalPaymentWhatsAppRequired"),
          });
        }
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
