"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { ImagePlaceholder, VideoPlaceholder } from "@/components/ui/media-placeholder";
import { GALLERY } from "@/lib/data";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";

export function Gallery() {
  return (
    <Section id="gallery">
      <SectionTitle eyebrow="من الميدان" title="أحدث" emphasis="الزيارات والفعاليات" />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {GALLERY.map((g) => (
          <motion.article
            key={g.title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="card flex flex-col gap-2.5"
          >
            <span className="text-primary text-xs font-bold">{g.tag}</span>
            <h3 className="text-title-card">{g.title}</h3>
            <p className="text-body-small">{g.body}</p>
            {g.type === "video" ? <VideoPlaceholder label={g.title} /> : <ImagePlaceholder label={g.title} />}
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
