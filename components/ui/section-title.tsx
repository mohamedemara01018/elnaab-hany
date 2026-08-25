"use client";

import { motion } from "motion/react";
import { fadeUp, revealViewport } from "@/lib/motion-variants";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  emphasis: string;
  blurb?: string;
}

export function SectionTitle({ eyebrow, title, emphasis, blurb }: SectionTitleProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
      className="section-title text-center max-w-xl mx-auto mb-12"
    >
      {eyebrow && <span className="text-label-overline">{eyebrow}</span>}
      <h2 className="text-headline-section mt-2">
        {title} <em className="font-decorative not-italic text-primary">{emphasis}</em>
      </h2>
      <i className="divider" />
      {blurb && <p className="text-body-main mt-1">{blurb}</p>}
    </motion.div>
  );
}
