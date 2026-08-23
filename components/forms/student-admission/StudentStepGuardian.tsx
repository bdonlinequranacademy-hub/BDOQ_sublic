"use client";

import { Controller, useFormContext } from "react-hook-form";
import { BilingualLabel } from "@/components/forms/shared/BilingualLabel";
import { PhoneInput } from "@/components/forms/shared/PhoneInput";
import {
  formErrorClass,
  formInputClass,
} from "@/components/forms/shared/formStyles";
import type { StudentAdmissionFormValues } from "@/lib/validators/studentAdmission";

export function StudentStepGuardian() {
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
            htmlFor="parentName"
            labelBn="অভিভাবকের নাম"
            labelEn="Guardian name"
            required
          />
          <input
            id="parentName"
            className={formInputClass}
            {...register("parentName")}
          />
          {errors.parentName && (
            <p className={formErrorClass}>{errors.parentName.message}</p>
          )}
        </div>
        <div className="min-w-0">
          <BilingualLabel
            htmlFor="parentWhatsapp"
            labelBn="অভিভাবকের WhatsApp"
            labelEn="Guardian WhatsApp"
            required
          />
          <Controller
            name="parentWhatsapp"
            control={control}
            render={({ field }) => (
              <PhoneInput
                id="parentWhatsapp"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.parentWhatsapp && (
            <p className={formErrorClass}>{errors.parentWhatsapp.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
