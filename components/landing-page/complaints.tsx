"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { CitizenRequestForm } from "@/components/landing-page/citizen-request-form";
import { fadeUp, revealViewport } from "@/lib/motion-variants";

export function Complaints() {
  const [formTab, setFormTab] = useState<"complaint" | "proposal">("complaint");

  return (
    <Section id="complaints">
      <div className="max-w-2xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          className="text-center mb-8"
        >
          <span className="text-primary font-bold text-sm">نحن نستمع إليك</span>
          <h2 className="text-headline-section mt-2" style={{ fontSize: 34 }}>
            خدمات <em className="font-decorative not-italic text-primary">المواطن الرقمية</em>
          </h2>
          <p className="text-body-main mt-3">
            يمكنك إرسال شكوى أو طلب، أو مشاركة فكرة ومقترح مع مكتب النائب من خلال النموذج المناسب، وسيتم مراجعة البيانات والتواصل معك.
          </p>
        </motion.div>

        <div role="tablist" aria-label="اختيار نوع الخدمة" className="flex gap-2.5 bg-surface-container p-1.5 rounded-full mb-7">
          <button
            id="tab-complaint"
            type="button"
            role="tab"
            aria-selected={formTab === "complaint"}
            aria-controls="panel-complaint"
            onClick={() => setFormTab("complaint")}
            className={`relative flex-1 border-none py-3 rounded-full cursor-pointer font-display font-bold text-sm ${formTab === "complaint" ? "text-gold-highlight bg-surface-container-highest" : "bg-transparent text-on-surface-variant"
              }`}
          >
            {formTab === "complaint" && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            تقديم شكوى أو طلب
          </button>
          <button
            id="tab-proposal"
            type="button"
            role="tab"
            aria-selected={formTab === "proposal"}
            aria-controls="panel-proposal"
            onClick={() => setFormTab("proposal")}
            className={`relative flex-1 border-none py-3 rounded-full cursor-pointer font-display font-bold text-sm ${formTab === "proposal" ? "text-gold-highlight bg-surface-container-highest" : "bg-transparent text-on-surface-variant"
              }`}
          >
            {formTab === "proposal" && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            تقديم مقترح
          </button>
        </div>

        <div
          role="tabpanel"
          id={`panel-${formTab}`}
          aria-labelledby={`tab-${formTab}`}
        >
          <CitizenRequestForm variant={formTab} />
        </div>
      </div>
    </Section>
  );
}
