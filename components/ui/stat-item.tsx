"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import type { Stat } from "@/lib/types";
import { fadeUp } from "@/lib/motion-variants";

function useAnimatedCounter(target: number, active: boolean): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

export function StatItem({ target, label }: Stat) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const value = useAnimatedCounter(target, inView);

  return (
    <motion.div ref={ref} variants={fadeUp} className="text-center">
      <strong className="text-display-hero block text-4xl md:text-5xl text-gold-highlight">
        {value.toLocaleString("ar-EG")}
      </strong>
      <span className="text-body-small block mt-1 text-white">{label}</span>
    </motion.div>
  );
}
