"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { FACTS } from "@/lib/data";
import { fadeUp, scaleIn, staggerContainer, revealViewport } from "@/lib/motion-variants";
import imgFallback from "@/public/help_people.jpg";
import { HeroInfoData, GetHeroInfoResponse } from "@/types/hero.types";

interface AboutProps {
  data?: HeroInfoData | GetHeroInfoResponse | null;
}

export function About({ data }: AboutProps) {
  // Handles unwrapping data if it is standard HeroInfoData or inside GetHeroInfoResponse
  const heroInfo: HeroInfoData | null =
    data && "value" in data ? (data.value as HeroInfoData) : (data as HeroInfoData | null);

  const name = heroInfo?.fullName ? `النائب ${heroInfo.fullName}` : "النائب هاني شحاتة";
  const aboutPart1 = heroInfo?.aboutPart1;
  const aboutPart2 = heroInfo?.aboutPart2;

  const facts = heroInfo
    ? [
      { icon: "📅", label: "تاريخ الميلاد", value: heroInfo.birthOfDate || "19 يونيو 1983" },
      { icon: "📍", label: "محل الإقامة", value: heroInfo.address || "مدينة بنها - القليوبية" },
      { icon: "⏰", label: "مواعيد التواصل", value: heroInfo.appointment || "1 ظهراً - 10 مساءً" },
      { icon: "🏛️", label: "الدائرة", value: heroInfo.circle || "بنها وكفر شكر" },
    ]
    : FACTS;

  return (
    <Section id="about" className="bg-surface-container-low">
      <SectionTitle eyebrow="من نحن" title="السيرة" emphasis="الذاتية" />

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid md:grid-cols-[0.8fr_1.2fr] gap-14 items-center"
      >
        <motion.div
          variants={scaleIn}
          className="service-container relative overflow-hidden aspect-square md:aspect-auto h-full min-h-80 rounded-2xl"
          style={{ boxShadow: "var(--shadow-level-2)" }}
        >
          <Image
            src={imgFallback}
            alt={`${name} - جولة ميدانية لخدمة المواطنين`}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-primary text-on-primary px-4 py-2.5 rounded-md font-display text-sm font-bold z-10">
            خدمة
            <br />
            المواطن
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <span className="text-label-overline">{name}</span>
          <h3 className="font-display text-2xl md:text-3xl font-bold mt-2.5 leading-snug">
            نعمل من أجل المواطن
            <br />
            <em className="font-decorative not-italic text-primary">ونستمع لصوته</em>
          </h3>

          {aboutPart1 || aboutPart2 ? (
            <>
              {aboutPart1 && <p className="text-body-main mt-4 whitespace-pre-line">{aboutPart1}</p>}
              {aboutPart2 && <p className="text-body-main mt-4 whitespace-pre-line">{aboutPart2}</p>}
            </>
          ) : (
            <>
              <p className="text-body-main mt-4">
                أهلاً بكم في الموقع الرسمي للنائب هاني شحاتة، عضو مجلس النواب عن دائرة بنها وكفر شكر. تم إنشاء هذه المنصة لتكون حلقة وصل مباشرة بين المواطن ومكتب النائب.
              </p>
              <p className="text-body-main mt-4">
                يمكنكم من خلال الموقع التعرف على أهم الملفات والأنشطة والزيارات، والتواصل مع المكتب وتقديم الطلبات والشكاوى.
              </p>
            </>
          )}

          <motion.div
            variants={staggerContainer(0.08)}
            className="grid grid-cols-2 gap-4 mt-7"
          >
            {facts.map((f) => (
              <motion.div key={f.label} variants={fadeUp} className="bg-surface-container rounded-lg p-4">
                <span>{f.icon}</span>
                <small className="block text-on-surface-variant text-xs mt-1.5">{f.label}</small>
                <strong className="text-title-card">{f.value}</strong>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
}