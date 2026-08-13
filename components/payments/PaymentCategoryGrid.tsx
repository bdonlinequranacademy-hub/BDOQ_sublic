import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Gift,
  HeartHandshake,
  GraduationCap,
  CalendarCheck,
  HandHeart,
  Sparkles,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { PUBLIC_PAYMENT_CARDS } from "@/lib/optionalPayments";

const CARD_ICONS = {
  admission_fee: GraduationCap,
  monthly_tuition: CalendarCheck,
  teacher_bakhshish: Gift,
  eid_gift: Sparkles,
  sponsor_student: HeartHandshake,
  sadaqah: HandHeart,
  custom: Wallet,
} as const;

type CardId = (typeof PUBLIC_PAYMENT_CARDS)[number]["id"];

export async function PaymentCategoryGrid() {
  const t = await getTranslations("pages.payments");

  return (
    <div>
      <h2 className="font-playfair text-2xl font-bold text-primary-dark md:text-3xl">
        {t("categoriesTitle")}
      </h2>
      <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-text-gray md:text-base">
        {t("categoriesSubtitle")}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PUBLIC_PAYMENT_CARDS.map((card) => {
          const Icon = CARD_ICONS[card.id as CardId];

          return (
            <Link
              key={card.id}
              href={card.href}
              className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-inter text-lg font-semibold text-primary-dark">
                {t(`cards.${card.id}.title`)}
              </h3>
              <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-text-gray">
                {t(`cards.${card.id}.description`)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {t("goToForm")}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
