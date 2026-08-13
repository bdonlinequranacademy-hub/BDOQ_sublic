"use client";

import { useMemo } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import {
  formErrorClass,
  formHintClass,
  formInputClass,
  formSelectChevronClass,
  formSelectClass,
  formSelectWrapperClass,
} from "@/components/forms/shared/formStyles";
import { COUNTRY_OPTIONS } from "@/lib/formOptions";
import { pickBilingualLabel } from "@/lib/i18n/formLocale";
import { useFormLocale } from "@/lib/i18n/useFormLocale";
import {
  getAddressFieldLabels,
  getCitiesForDistrict,
  getCountryAddressProfile,
  getDistrictsForState,
  getPostalCodesForCity,
  getStatesForCountry,
} from "@/lib/location/addressLocations";
import { cn } from "@/lib/cn";

interface IAddressFieldsProps<T extends Record<string, unknown>> {
  prefix: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  titleBn?: string;
  titleEn?: string;
  disabled?: boolean;
}

function fieldName(prefix: string, key: string): string {
  return prefix ? `${prefix}${key}` : key;
}

function LocationSelect({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
  disabled = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-body text-sm text-text-gray">
        {label}
      </label>
      <div className={formSelectWrapperClass}>
        <select
          id={id}
          className={formSelectClass}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {value && !options.includes(value) ? (
            <option value={value}>{value}</option>
          ) : null}
        </select>
        <ChevronDown className={formSelectChevronClass} aria-hidden="true" />
      </div>
      {error && <p className={formErrorClass}>{error}</p>}
    </div>
  );
}

function PostalCodeField({
  id,
  label,
  placeholder,
  hint,
  value,
  onChange,
  options,
  error,
  disabled = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  disabled?: boolean;
}) {
  const listId = `${id}-suggestions`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-body text-sm text-text-gray">
        {label}
      </label>
      <input
        id={id}
        list={options.length > 0 ? listId : undefined}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={formInputClass}
        autoComplete="postal-code"
      />
      {options.length > 0 ? (
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
      <p className={formHintClass}>{hint}</p>
      {error && <p className={formErrorClass}>{error}</p>}
    </div>
  );
}

export function AddressFields<T extends Record<string, unknown>>({
  prefix,
  register,
  errors,
  titleBn,
  titleEn,
  disabled = false,
}: IAddressFieldsProps<T>) {
  const t = useTranslations("forms.address");
  const locale = useFormLocale();
  const { control, setValue } = useFormContext<T>();

  const line1 = fieldName(prefix, "AddressLine1");
  const line2 = fieldName(prefix, "AddressLine2");
  const stateField = fieldName(prefix, "State");
  const city = fieldName(prefix, "City");
  const district = fieldName(prefix, "District");
  const postalCode = fieldName(prefix, "PostalCode");
  const country = fieldName(prefix, "Country");

  const watchString = (name: string): string =>
    String(useWatch({ control, name: name as never }) ?? "");

  const countryValue = watchString(country);
  const stateValue = watchString(stateField);
  const districtValue = watchString(district);
  const cityValue = watchString(city);

  const profile = useMemo(
    () => (countryValue ? getCountryAddressProfile(countryValue) : null),
    [countryValue]
  );

  const labels = useMemo(
    () => getAddressFieldLabels(countryValue ?? ""),
    [countryValue]
  );

  const stateOptions = useMemo(
    () => getStatesForCountry(countryValue ?? "").map((s) => s.name),
    [countryValue]
  );

  const districtOptions = useMemo(
    () => getDistrictsForState(countryValue ?? "", stateValue ?? "").map((d) => d.name),
    [countryValue, stateValue]
  );

  const cityOptions = useMemo(
    () =>
      getCitiesForDistrict(countryValue ?? "", stateValue ?? "", districtValue ?? "").map(
        (c) => c.name
      ),
    [countryValue, stateValue, districtValue]
  );

  const postalOptions = useMemo(
    () =>
      getPostalCodesForCity(
        countryValue ?? "",
        stateValue ?? "",
        districtValue ?? "",
        cityValue ?? ""
      ),
    [countryValue, stateValue, districtValue, cityValue]
  );

  const setField = (name: string, value: string): void => {
    setValue(name as never, value as never, { shouldValidate: true, shouldDirty: true });
  };

  const handleCountryChange = (value: string): void => {
    setField(country, value);
    setField(stateField, "");
    setField(district, "");
    setField(city, "");
    setField(postalCode, "");
  };

  const handleStateChange = (value: string): void => {
    setField(stateField, value);
    setField(district, "");
    setField(city, "");
    setField(postalCode, "");
  };

  const handleDistrictChange = (value: string): void => {
    setField(district, value);
    setField(city, "");
    setField(postalCode, "");
  };

  const handleCityChange = (value: string): void => {
    setField(city, value);
    const codes = getPostalCodesForCity(
      countryValue ?? "",
      stateValue ?? "",
      districtValue ?? "",
      value
    );
    if (codes.length === 1) {
      setField(postalCode, codes[0]);
      return;
    }
    setField(postalCode, "");
  };

  const getError = (key: string): string | undefined => {
    const error = errors[key as keyof typeof errors];
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }
    return undefined;
  };

  const sectionTitle =
    titleBn && titleEn
      ? pickBilingualLabel({ labelBn: titleBn, labelEn: titleEn }, locale)
      : null;

  return (
    <div className={cn("space-y-4", disabled && "opacity-90")}>
      {sectionTitle && (
        <h3 className="font-body text-sm font-semibold text-primary-dark">
          {sectionTitle}
        </h3>
      )}

      <LocationSelect
        id={`${prefix}-country`}
        label={t("country")}
        placeholder={t("selectCountry")}
        value={countryValue ?? ""}
        onChange={handleCountryChange}
        options={COUNTRY_OPTIONS}
        error={getError(country)}
        disabled={disabled}
      />

      {profile ? (
        <>
          <LocationSelect
            id={`${prefix}-state`}
            label={labels.state}
            placeholder={t("selectState")}
            value={stateValue ?? ""}
            onChange={handleStateChange}
            options={stateOptions}
            error={getError(stateField)}
            disabled={disabled || !countryValue}
          />

          <LocationSelect
            id={`${prefix}-district`}
            label={labels.district}
            placeholder={t("selectDistrict")}
            value={districtValue ?? ""}
            onChange={handleDistrictChange}
            options={districtOptions}
            error={getError(district)}
            disabled={disabled || !stateValue}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <LocationSelect
              id={`${prefix}-city`}
              label={labels.city}
              placeholder={t("selectCity")}
              value={cityValue ?? ""}
              onChange={handleCityChange}
              options={cityOptions}
              error={getError(city)}
              disabled={disabled || !districtValue}
            />

            <Controller
              name={postalCode as never}
              control={control}
              render={({ field }) => (
                <PostalCodeField
                  id={`${prefix}-postal`}
                  label={labels.postalCode}
                  placeholder={t("selectPostal")}
                  hint={t("postalHint")}
                  value={String(field.value ?? "")}
                  onChange={field.onChange}
                  options={postalOptions}
                  error={getError(postalCode)}
                  disabled={disabled}
                />
              )}
            />
          </div>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input
              placeholder={t("city")}
              className={formInputClass}
              disabled={disabled}
              {...register(city as never)}
            />
            {getError(city) && <p className={formErrorClass}>{getError(city)}</p>}
          </div>
          <div>
            <input
              placeholder={t("district")}
              className={formInputClass}
              disabled={disabled}
              {...register(district as never)}
            />
            {getError(district) && (
              <p className={formErrorClass}>{getError(district)}</p>
            )}
          </div>
        </div>
      )}

      <div>
        <input
          placeholder={t("line1")}
          className={formInputClass}
          disabled={disabled}
          {...register(line1 as never)}
        />
        {getError(line1) && <p className={formErrorClass}>{getError(line1)}</p>}
      </div>

      <input
        placeholder={t("line2")}
        className={formInputClass}
        disabled={disabled}
        {...register(line2 as never)}
      />
    </div>
  );
}
