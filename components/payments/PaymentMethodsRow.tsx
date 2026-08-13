import { getTranslations } from "next-intl/server";
import {
  OPTIONAL_PAYMENT_ACCOUNTS,
  OPTIONAL_PAYMENT_METHODS,
} from "@/lib/optionalPayments";

export async function PaymentMethodsRow() {
  const t = await getTranslations("pages.payments");

  return (
    <div className="mt-14">
      <h2 className="font-playfair text-2xl font-bold text-primary-dark md:text-3xl">
        {t("methodsTitle")}
      </h2>
      <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-text-gray md:text-base">
        {t("methodsSubtitle")}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OPTIONAL_PAYMENT_METHODS.map((method) => {
          const account = OPTIONAL_PAYMENT_ACCOUNTS[method];
          return (
            <div
              key={method}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="font-inter text-sm font-semibold text-primary-dark">
                {t(`methods.${method}`)}
              </p>
              {"number" in account ? (
                <p className="mt-2 font-body text-sm text-text-gray">
                  {account.number}
                </p>
              ) : (
                <p className="mt-2 font-body text-sm text-text-gray">
                  {account.accountName}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
