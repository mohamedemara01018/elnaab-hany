"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { ImagePlaceholder } from "@/components/ui/media-placeholder";
import { FACTS } from "@/lib/data";
import { fadeUp, scaleIn, staggerContainer, revealViewport } from "@/lib/motion-variants";
import img from '@/public/721082606_122225076506346497_7612991756831435743_n.jpg'
import Image from "next/image";
export function About() {
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
          className="service-container relative overflow-hidden aspect-auto"
          style={{ boxShadow: "var(--shadow-level-2)" }}
        >
          <Image src={img} alt="النائب هاني شحاتة - جولة ميدانية لخدمة المواطنين" />
          <div className="absolute bottom-4 left-4 bg-primary text-on-primary px-4 py-2.5 rounded-md font-display text-sm font-bold">
            خدمة
            <br />
            المواطن
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <span className="text-label-overline">النائب هاني شحاتة</span>
          <h3 className="font-display text-2xl md:text-3xl font-bold mt-2.5 leading-snug">
            نعمل من أجل المواطن
            <br />
            <em className="font-decorative not-italic text-primary">ونستمع لصوته</em>
          </h3>
          <p className="text-body-main mt-4">
            أهلاً بكم في الموقع الرسمي للنائب هاني شحاتة، عضو مجلس النواب عن دائرة بنها وكفر شكر. تم إنشاء هذه المنصة لتكون حلقة وصل مباشرة بين المواطن ومكتب النائب.
          </p>
          <p className="text-body-main mt-4">
            يمكنكم من خلال الموقع التعرف على أهم الملفات والأنشطة والزيارات، والتواصل مع المكتب وتقديم الطلبات والشكاوى.
          </p>

          <motion.div
            variants={staggerContainer(0.08)}
            className="grid grid-cols-2 gap-4 mt-7"
          >
            {FACTS.map((f) => (
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
