"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { staggerContainer, fadeUp, scaleIn } from "@/lib/motion-variants";
import imgFallback from "@/public/hanyImage.jpg";
import { HeroInfoData, GetHeroInfoResponse } from "@/types/hero.types";

interface HeroProps {
  data?: HeroInfoData | GetHeroInfoResponse | null;
}

export function Hero({ data }: HeroProps) {
  // Unwraps data whether it comes as raw HeroInfoData or inside GetHeroInfoResponse
  const heroInfo: HeroInfoData | null =
    data && "value" in data ? (data.value as HeroInfoData) : (data as HeroInfoData | null);

  const name = heroInfo?.fullName || "هاني شحاتة";
  const title = heroInfo?.title || "عضو مجلس النواب عن دائرة بنها وكفر شكر";
  const description =
    heroInfo?.bio ||
    "منصة رسمية للتواصل مع المواطنين، تقديم الشكاوى والمقترحات، واستعراض أهم الملفات والأنشطة والزيارات.";
  const siteTitle = heroInfo?.circle || "الموقع الرسمي";
  const imageSrc = heroInfo?.mediaUrl || imgFallback;

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
            {siteTitle}
          </motion.span>

          <motion.h1 variants={fadeUp} className="text-display-hero">
            النائب
            <span className="block text-primary">{name}</span>
          </motion.h1>

          <motion.h2 variants={fadeUp} className="font-display text-lg md:text-xl font-medium text-secondary mt-3">
            {title}
          </motion.h2>

          <motion.p variants={fadeUp} className="text-body-main mt-4 max-w-md">
            {description}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5 mt-7">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#complaints"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 font-display font-bold text-sm"
            >
              <span>تقديم شكوى</span>
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
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
          className="service-container border-4 border-surface-container-lowest overflow-hidden relative w-full h-[380px] md:h-[480px]"
          style={{ boxShadow: "var(--shadow-level-2)" }}
        >
          <Image
            src={imageSrc}
            alt={`النائب ${name} - ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
            unoptimized={typeof imageSrc === "string"}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-center mt-14 text-xs text-on-surface-variant flex flex-col items-center"
      >
        <span>اكتشف المزيد</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 mt-1 shrink-0" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  );
}