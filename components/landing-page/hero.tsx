"use client";

import { motion } from "motion/react";
import { ImagePlaceholder } from "@/components/ui/media-placeholder";
import { staggerContainer, fadeUp, scaleIn } from "@/lib/motion-variants";
import img from '@/public/702718504_122221557020346497_6976720022155079154_n.jpg'
import Image from "next/image";
export function Hero() {
  return (
    <section id="home" className="relative py-16 md:py-28 overflow-hidden">
      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate="show"
        className="wrapper grid md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <motion.span variants={fadeUp} className="text-label-overline inline-block mb-3">
            الموقع الرسمي
          </motion.span>

          <motion.h1 variants={fadeUp} className="text-display-hero">
            النائب
            <span className="block text-primary">هاني شحاتة</span>
          </motion.h1>

          <motion.h2 variants={fadeUp} className="font-display text-lg md:text-xl font-medium text-secondary mt-3">
            عضو مجلس النواب عن دائرة بنها وكفر شكر
          </motion.h2>

          <motion.p variants={fadeUp} className="text-body-main mt-4 max-w-md">
            منصة رسمية للتواصل مع المواطنين، تقديم الشكاوى والمقترحات، واستعراض أهم الملفات والأنشطة والزيارات.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5 mt-7">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#complaints"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 font-display font-bold text-sm"
            >
              تقديم شكوى <span>←</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#about"
              className="btn-outline inline-flex items-center gap-2 px-6 py-3.5 font-display font-bold text-sm"
            >
              تعرف علينا
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          variants={scaleIn}
          className="service-container border-4 border-surface-container-lowest overflow-hidden "
          style={{ boxShadow: "var(--shadow-level-2)" }}
        >
          <Image src={img} alt="النائب هاني شحاتة - عضو مجلس النواب" className="object-cover" priority />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-center mt-14 text-xs text-on-surface-variant"
      >
        اكتشف المزيد
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
