"use client";

import { motion } from "motion/react";
import type { WorkItem } from "@/lib/types";
import { ImagePlaceholder } from "@/components/ui/media-placeholder";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";
import img from '@/public/721082606_122225076506346497_7612991756831435743_n.jpg'
import Image from "next/image";
export function NumberedCardGrid({ items }: { items: WorkItem[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <motion.article
          key={item.n}
          variants={fadeUp}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="card flex flex-col gap-3"
        >
          <span className="font-display font-extrabold text-2xl text-primary-container">{item.n}</span>
          <h3 className="text-title-card">{item.title}</h3>
          <Image src={img} alt={item.title} />
          {/* <ImagePlaceholder label={item.title} /> */}
          <p className="text-body-small">{item.body}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}
