"use client";

import { motion } from "motion/react";
import { StatItem } from "@/components/ui/stat-item";
import { STATS } from "@/lib/data";
import { staggerContainer, revealViewport } from "@/lib/motion-variants";

export function Stats() {
  return (
    <section className="bg-slate-dark py-14">
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="wrapper grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
      >
        {STATS.map((s) => (
          <StatItem key={s.label} target={s.target} label={s.label} />
        ))}
      </motion.div>
    </section>
  );
}
