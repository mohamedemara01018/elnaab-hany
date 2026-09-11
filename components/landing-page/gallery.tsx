"use client";

import { motion } from "motion/react";
import { ImageOff } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import Image from "next/image";
import { ActivityVisit, GetActivitiesVisitsResponse } from "@/types/activity-visit.types";
import { getMediaUrl } from "@/utils/functions.utils";
import EmptyState from "@/components/ui/Emptystate";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";

interface GalleryProps {
  data?: GetActivitiesVisitsResponse | ActivityVisit[] | null;
}

export function Gallery({ data }: GalleryProps) {
  // Safely extract items whether data is the full response object or an array
  const apiItems: ActivityVisit[] | null = Array.isArray(data)
    ? data
    : data && "value" in data && Array.isArray(data.value)
      ? data.value
      : null;

  const hasItems = Array.isArray(apiItems) && apiItems.length > 0;

  return (
    <Section id="gallery" className="bg-surface-container-low">
      <SectionTitle eyebrow="من الميدان" title="أحدث" emphasis="الزيارات والفعاليات" />

      {!hasItems ? (
        <EmptyState
          icon={ImageOff}
          title="لا توجد زيارات أو فعاليات معروضة حالياً"
          description="سيتم إضافة الصور والزيارات الميدانية الجديدة فور توفرها."
          size="large"
        />
      ) : (
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-8"
        >
          {apiItems.map((item, index) => {
            const formattedMediaUrl = getMediaUrl(item.mediaUrl);
            const formattedDate = item.date
              ? new Date(item.date).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              : null;

            return (
              <motion.article
                key={item.id ? `${item.id}-${index}` : `${item.title}-${index}`}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="card flex flex-col gap-3.5 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  {item.location && (
                    <span className="font-bold text-primary px-3 py-1 rounded-xl bg-primary/10 border border-primary/20">
                      📍 {item.location}
                    </span>
                  )}
                  {formattedDate && (
                    <span className="text-on-surface-variant/80 font-medium px-2.5 py-1 rounded-lg bg-surface-container-high/60">
                      📅 {formattedDate}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {item.title || "زيارة ميدانية"}
                </h3>

                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20">
                  <Image
                    src={formattedMediaUrl}
                    alt={item.title || "صورة الفعالية"}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    unoptimized={typeof formattedMediaUrl === "string"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                </div>

                {item.description && (
                  <p className="text-body-small text-on-surface-variant/90 line-clamp-3 text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      )}
    </Section>
  );
}