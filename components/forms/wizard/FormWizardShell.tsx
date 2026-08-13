"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useStepTitle } from "@/lib/i18n/useFormLocale";
import type { FormLayoutVariant } from "@/lib/forms/formLayout";
import { FormCard } from "@/components/forms/shared/FormCard";
import { FormPageLayout } from "@/components/forms/shared/FormPageLayout";
import type { IWizardStep } from "@/components/forms/wizard/WizardProgress";
import { WizardNavigation } from "@/components/forms/wizard/WizardNavigation";
import { WizardProgress } from "@/components/forms/wizard/WizardProgress";

interface IFormWizardShellProps {
  layoutVariant: FormLayoutVariant;
  steps: IWizardStep[];
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  nextLabel?: string;
  submitLabel?: string;
  children: ReactNode;
}

const panelMotion = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

export function FormWizardShell({
  layoutVariant,
  steps,
  currentStep,
  onBack,
  onNext,
  isSubmitting = false,
  nextLabel,
  submitLabel,
  children,
}: IFormWizardShellProps) {
  const stepTitle = useStepTitle();
  const activeStep = steps[currentStep];
  const stepTopRef = useRef<HTMLDivElement>(null);
  const skipInitialScroll = useRef(true);

  useEffect(() => {
    if (skipInitialScroll.current) {
      skipInitialScroll.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      const node = stepTopRef.current;
      if (!node) return;
      const headerOffset = window.matchMedia("(min-width: 768px)").matches
        ? 140
        : 96;
      const top =
        node.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [currentStep]);

  return (
    <FormPageLayout
      variant={layoutVariant}
      steps={steps}
      currentStep={currentStep}
    >
      <FormCard>
        <div ref={stepTopRef} className="scroll-mt-28 md:scroll-mt-36">
          <WizardProgress steps={steps} currentStep={currentStep} compact />

          <div className="mb-6 border-b border-gold/20 pb-5">
            <h2 className="font-playfair text-xl font-bold text-primary-dark md:text-2xl">
              {activeStep ? stepTitle(activeStep) : ""}
            </h2>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeStep?.id} {...panelMotion}>
            {children}
          </motion.div>
        </AnimatePresence>

        <WizardNavigation
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
          isSubmitting={isSubmitting}
          onBack={onBack}
          onNext={onNext}
          nextLabel={nextLabel}
          submitLabel={submitLabel}
        />
      </FormCard>
    </FormPageLayout>
  );
}
