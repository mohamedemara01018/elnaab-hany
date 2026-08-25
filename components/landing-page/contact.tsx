"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { CONTACT_CARDS, TEAM } from "@/lib/data";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";

export function Contact() {
  return (
    <Section id="contact">
      <SectionTitle
        eyebrow="تواصل معنا"
        title="نحن"
        emphasis="قريبون منك"
        blurb="تواصل مباشرة مع مكتب النائب أو مع أحد أعضاء فريق الخدمات."
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
      >
        {CONTACT_CARDS.map((c) => (
          <motion.div
            key={c.title}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className="card text-center flex flex-col items-center gap-2"
          >
            <div className="w-11.5 h-11.5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-lg mb-1">
              {c.icon}
            </div>
            <h3 className="text-title-card">{c.title}</h3>
            <p className="text-body-small">{c.body}</p>
            {c.link && (
              <a href={c.link.href} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-sm mt-1.5">
                {c.link.label}
              </a>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="text-center mb-7"
      >
        <span className="text-primary font-bold text-xs">فريق الخدمات</span>
        <h3 className="font-display text-2xl mt-1.5">
          فريق <em className="font-decorative not-italic text-primary">مكتب النائب</em>
        </h3>
        <p className="text-body-main mt-2">للتواصل والمتابعة مع المسؤول المختص حسب نوع الطلب.</p>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {TEAM.map((t) => (
          <motion.article
            key={t.n}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className={`card flex flex-col gap-2 ${t.office ? "bg-primary-container **:text-on-primary-container" : ""}`}
          >
            <span className="text-primary font-display font-extrabold">{t.n}</span>
            <h3 className="text-title-card">{t.name}</h3>
            <p className="text-body-small">{t.role}</p>
            <a href={`tel:${t.phone}`} className="text-primary font-bold mt-1.5">
              ☎ {t.phone}
            </a>
            {t.office && (
              <div className="mt-2.5 bg-white/35 rounded-md p-2.5 text-sm">
                <strong>مواعيد التواصل</strong>
                <div>يومياً من 1:00 ظهراً حتى 10:00 مساءً</div>
              </div>
            )}
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
