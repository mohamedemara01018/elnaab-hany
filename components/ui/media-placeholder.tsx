"use client";

import { motion } from "motion/react";

export function ImagePlaceholder({ label }: { label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="img"
      aria-label={label}
      className="bg-surface-container-high text-outline flex items-center justify-center rounded-md aspect-16/10 text-2xl"
    >
      🖼
    </motion.div>
  );
}

export function VideoPlaceholder({ label }: { label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="img"
      aria-label={label}
      className="bg-surface-container-high text-outline flex items-center justify-center rounded-md aspect-video text-2xl"
    >
      ▶
    </motion.div>
  );
}
