"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image, { StaticImageData } from "next/image";
import { MapPin, Calendar, ArrowLeft, X } from "lucide-react";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";
import defaultImg from "@/public/help_people.jpg";

export interface CardItem {
  id?: number | string;
  title?: string;
  description?: string;
  desc?: string;
  body?: string;
  mediaUrl?: string;
  imageUrl?: string | StaticImageData;
  num?: string;
  n?: string;
  location?: string;
  date?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface NumberedCardGridProps {
  items: CardItem[];
}

export function NumberedCardGrid({ items }: NumberedCardGridProps) {
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    description: string;
    imageSrc: string | StaticImageData;
    numberLabel: string;
    location?: string;
    date?: string;
  } | null>(null);

  return (
    <>
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-8"
      >
        {items.map((item, index) => {
          const numberLabel = item.num || item.n || String(index + 1).padStart(2, "0");
          const title = item.title || "";
          const description = item.description || item.desc || item.body || "";
          const imageSrc = item.mediaUrl || item.imageUrl || defaultImg;
          const location = item.location;
          const date = item.date;

          return (
            <motion.article
              key={item.id ? `${item.id}-${index}` : `${title}-${index}`}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() =>
                setSelectedItem({
                  title,
                  description,
                  imageSrc,
                  numberLabel,
                  location,
                  date,
                })
              }
              className="card flex flex-col justify-between cursor-pointer group bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col gap-3.5">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-sm px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                    {numberLabel}
                  </span>
                  {location && (
                    <span className="text-xs bg-surface-container-high/70 px-3 py-1 rounded-full text-on-surface-variant font-semibold backdrop-blur-xs inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" aria-hidden="true" />
                      <span>{location}</span>
                    </span>
                  )}
                </div>

                {/* Media Image Container */}
                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20">
                  <Image
                    src={imageSrc}
                    alt={title || "صورة"}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    unoptimized={typeof imageSrc === "string"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {title}
                </h3>

                {/* Date tag if available */}
                {date && (
                  <span className="text-xs text-primary font-medium inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{new Date(date).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </span>
                )}

                {/* Description snippet */}
                {description && (
                  <p className="text-body-small text-on-surface-variant/90 line-clamp-3 leading-relaxed text-sm">
                    {description}
                  </p>
                )}
              </div>

              {/* Action Footer Link */}
              <div className="mt-5 pt-3.5 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-primary">
                <span>استعرض التفاصيل</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300 shrink-0" aria-hidden="true" />
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Interactive Modal Preview */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-auto border border-outline-variant/30"
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="إغلاق النافذة"
                className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all font-bold cursor-pointer backdrop-blur-sm shadow-md hover:scale-105"
              >
                <X className="w-5 h-5 shrink-0" aria-hidden="true" />
              </button>

              <div className="relative w-full h-72 sm:h-96 bg-surface-container">
                <Image
                  src={selectedItem.imageSrc}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                  unoptimized={typeof selectedItem.imageSrc === "string"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="p-6 sm:p-8 flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-sm px-3.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    {selectedItem.numberLabel}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
                    {selectedItem.title}
                  </h3>
                </div>

                {(selectedItem.location || selectedItem.date) && (
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-on-surface-variant font-medium">
                    {selectedItem.location && (
                      <span className="bg-surface-container px-3.5 py-1.5 rounded-lg border border-outline-variant/20 inline-flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{selectedItem.location}</span>
                      </span>
                    )}
                    {selectedItem.date && (
                      <span className="bg-surface-container px-3.5 py-1.5 rounded-lg border border-outline-variant/20 inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{new Date(selectedItem.date).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </span>
                    )}
                  </div>
                )}

                {selectedItem.description && (
                  <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed whitespace-pre-line mt-2">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}