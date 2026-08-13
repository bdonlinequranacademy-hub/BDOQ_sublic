import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getMessages } from "next-intl/server";
import { SITE_URL } from "@/lib/constants";
import { ClientMessagesProvider } from "@/components/i18n/ClientMessagesProvider";
import { getPaymentsClientMessages } from "@/lib/i18n/clientShellMessages";
import { PaymentsPageHero } from "@/components/payments/PaymentsPageHero";
import { PaymentCategoryGrid } from "@/components/payments/PaymentCategoryGrid";
import { PaymentMethodsRow } from "@/components/payments/PaymentMethodsRow";

const OptionalPaymentForm = dynamic(
  () =>
    import("@/components/forms/OptionalPaymentForm").then((m) => ({
      default: m.OptionalPaymentForm,
    })),
  {
    loading: () => (
      <div
        className="mt-14 h-[520px] animate-pulse rounded-2xl border border-gray-100 bg-white p-8"
        aria-hidden="true"
      />
    ),
  }
);

export const metadata: Metadata = {
  title: "Payments & Gifts",
  description:
    "Pay admission or monthly Quran tuition, or send an optional teacher gift, Eid salami, student sponsorship, sadaqah, or custom payment to BD Online Quran Academy.",
  keywords: [
    "quran academy payment",
    "bKash nagad rocket",
    "quran teacher gift",
    "sadaqah donation",
    "sponsor quran student",
    "BDOQ Academy",
  ],
  openGraph: {
    title: "Payments & Gifts | BD Online Quran Academy",
    description:
      "Optional gifts, sadaqah, sponsorship, and custom payments — plus links to admission and monthly tuition.",
    url: `${SITE_URL}/payments`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/payments`,
  },
};

export default async function PaymentsPage() {
  const messages = await getMessages();
  const clientMessages = getPaymentsClientMessages(
    messages as Record<string, unknown>
  );

  return (
    <ClientMessagesProvider messages={clientMessages}>
      <PaymentsPageHero />
      <section className="bg-[#F9FBF9] pb-16 md:pb-24">
        <div className="site-container pt-2 md:pt-4">
          <PaymentCategoryGrid />
          <PaymentMethodsRow />
          <Suspense
            fallback={
              <div
                className="mt-14 h-[520px] animate-pulse rounded-2xl border border-gray-100 bg-white p-8"
                aria-hidden="true"
              />
            }
          >
            <OptionalPaymentForm />
          </Suspense>
        </div>
      </section>
    </ClientMessagesProvider>
  );
}
