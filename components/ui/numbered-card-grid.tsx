
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  X,
  ArrowUpLeft,
} from "lucide-react";

import {
  fadeUp,
  staggerContainer,
  revealViewport,
} from "@/lib/motion-variants";

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
  limit?: number;
  seeMoreHref?: string;
}

export function NumberedCardGrid({
  items,
  limit,
  seeMoreHref,
}: NumberedCardGridProps) {
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    description: string;
    imageSrc: string | StaticImageData;
    numberLabel: string;
    location?: string;
    date?: string;
  } | null>(null);

  const displayItems = limit ? items.slice(0, limit) : items;
  const hasMore = limit ? items.length > limit : false;

  return (
    <>
      {/* =========================
          Cards Grid
      ========================== */}
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-8"
      >
        {displayItems.map((item, index) => {
          const numberLabel =
            item.num ||
            item.n ||
            String(index + 1).padStart(2, "0");

          const title = item.title || "";

          const description =
            item.description ||
            item.desc ||
            item.body ||
            "";

          const imageSrc =
            item.mediaUrl ||
            item.imageUrl ||
            defaultImg;

          const location = item.location;
          const date = item.date;

          return (
            <motion.article
              key={
                item.id
                  ? `${item.id}-${index}`
                  : `${title}-${index}`
              }
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
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
              className="
                card
                flex
                flex-col
                justify-between
                cursor-pointer
                group
                bg-surface-container-lowest
                border
                border-outline-variant/30
                hover:border-primary/40
                p-5
                rounded-2xl
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
                relative
                overflow-hidden
              "
            >
              {/* Card Content */}
              <div className="flex flex-col gap-3.5">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between">
                  {/* Number */}
                  <span
                    className="
                      font-display
                      font-black
                      text-sm
                      px-3
                      py-1
                      rounded-xl
                      bg-primary/10
                      text-primary
                      border
                      border-primary/20
                      shadow-xs
                    "
                  >
                    {numberLabel}
                  </span>

                  {/* Location */}
                  {location && (
                    <span
                      className="
                        text-xs
                        bg-surface-container-high/70
                        px-3
                        py-1
                        rounded-full
                        text-on-surface-variant
                        font-semibold
                        backdrop-blur-xs
                        inline-flex
                        items-center
                        gap-1.5
                      "
                    >
                      <MapPin
                        className="w-3.5 h-3.5 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <span>{location}</span>
                    </span>
                  )}
                </div>

                {/* Image */}
                <div
                  className="
                    relative
                    w-full
                    h-52
                    rounded-xl
                    overflow-hidden
                    bg-surface-container
                    border
                    border-outline-variant/20
                  "
                >
                  <Image
                    src={imageSrc}
                    alt={title || "صورة"}
                    fill
                    sizes="
                      (max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw
                    "
                    className="
                      object-cover
                      group-hover:scale-108
                      transition-transform
                      duration-500
                      ease-out
                    "
                    unoptimized={typeof imageSrc === "string"}
                  />

                  {/* Image Overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-linear-to-t
                      from-black/50
                      via-transparent
                      to-transparent
                      opacity-40
                      group-hover:opacity-20
                      transition-opacity
                      duration-300
                    "
                  />
                </div>

                {/* Title */}
                <h3
                  className="
                    font-display
                    text-lg
                    font-bold
                    text-on-surface
                    group-hover:text-primary
                    transition-colors
                    line-clamp-2
                    leading-snug
                  "
                >
                  {title}
                </h3>

                {/* Date */}
                {date && (
                  <span
                    className="
                      text-xs
                      text-primary
                      font-medium
                      inline-flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Calendar
                      className="w-3.5 h-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span>
                      {new Date(date).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </span>
                )}

                {/* Description */}
                {description && (
                  <p
                    className="
                      text-body-small
                      text-on-surface-variant/90
                      line-clamp-3
                      leading-relaxed
                      text-sm
                    "
                  >
                    {description}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div
                className="
                  mt-5
                  pt-3.5
                  border-t
                  border-outline-variant/20
                  flex
                  items-center
                  justify-between
                  text-xs
                  font-bold
                  text-primary
                "
              >
                <span>استعرض التفاصيل</span>

                <ArrowLeft
                  className="
                    w-4
                    h-4
                    group-hover:-translate-x-1.5
                    transition-transform
                    duration-300
                    shrink-0
                  "
                  aria-hidden="true"
                />
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* =========================
          See More
      ========================== */}
      {hasMore && seeMoreHref && (
        <div className="flex justify-center mt-10">
          <Link
            href={seeMoreHref}
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-primary
              text-on-primary
              font-bold
              text-sm
              shadow-md
              hover:bg-primary/90
              hover:shadow-lg
              transition-all
              duration-300
              active:scale-95
            "
          >
            <span>عرض المزيد</span>

            <ArrowUpLeft
              className="w-4 h-4 shrink-0"
              aria-hidden="true"
            />
          </Link>
        </div>
      )}

      {/* =========================
          Details Modal
      ========================== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedItem(null)}
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              p-4
              bg-black/60
              backdrop-blur-xs
            "
            role="presentation"
          >
            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
                y: 15,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: 15,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                w-full
                max-w-2xl
                bg-surface-container-lowest
                rounded-3xl
                shadow-2xl
                border
                border-outline-variant/30
                overflow-hidden
                max-h-[90vh]
                flex
                flex-col
              "
              role="dialog"
              aria-modal="true"
              aria-label="تفاصيل العنصر"
            >
              {/* =========================
                  Modal Header
              ========================== */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  p-5
                  border-b
                  border-outline-variant/20
                  bg-surface-container-low/50
                "
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Number */}
                  <span
                    className="
                      shrink-0
                      font-display
                      font-black
                      text-sm
                      px-3
                      py-1
                      rounded-xl
                      bg-primary/10
                      text-primary
                      border
                      border-primary/20
                    "
                  >
                    {selectedItem.numberLabel}
                  </span>

                  {/* Title */}
                  <h3
                    className="
                      font-display
                      text-lg
                      font-bold
                      text-on-surface
                      truncate
                    "
                  >
                    {selectedItem.title}
                  </h3>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="
                    shrink-0
                    p-1.5
                    rounded-full
                    hover:bg-surface-container
                    text-on-surface-variant
                    hover:text-on-surface
                    transition-colors
                  "
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* =========================
                  Modal Content
              ========================== */}
              <div
                className="
                  p-6
                  overflow-y-auto
                  flex
                  flex-col
                  gap-5
                "
              >
                {/* Image */}
                <div
                  className="
                    relative
                    w-full
                    h-64
                    sm:h-80
                    rounded-2xl
                    overflow-hidden
                    bg-surface-container
                    border
                    border-outline-variant/20
                    shadow-inner
                    shrink-0
                  "
                >
                  <Image
                    src={selectedItem.imageSrc}
                    alt={selectedItem.title || "صورة"}
                    fill
                    sizes="
                      (max-width: 768px) 100vw,
                      672px
                    "
                    className="object-cover"
                    unoptimized={
                      typeof selectedItem.imageSrc === "string"
                    }
                  />
                </div>

                {/* Title */}
                <div>
                  <h2
                    className="
                      font-display
                      text-xl
                      sm:text-2xl
                      font-bold
                      text-on-surface
                      mb-2
                    "
                  >
                    {selectedItem.title}
                  </h2>

                  <div
                    className="
                      w-12
                      h-1
                      bg-primary
                      rounded-full
                      mb-4
                    "
                  />
                </div>

                {/* Meta Information */}
                {(selectedItem.location ||
                  selectedItem.date) && (
                    <div
                      className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                    >
                      {/* Location */}
                      {selectedItem.location && (
                        <span
                          className="
                          bg-surface-container
                          px-3.5
                          py-1.5
                          rounded-lg
                          border
                          border-outline-variant/20
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          sm:text-sm
                          text-on-surface-variant
                          font-medium
                        "
                        >
                          <MapPin
                            className="
                            w-4
                            h-4
                            shrink-0
                            text-primary
                          "
                            aria-hidden="true"
                          />

                          <span>
                            {selectedItem.location}
                          </span>
                        </span>
                      )}

                      {/* Date */}
                      {selectedItem.date && (
                        <span
                          className="
                          bg-surface-container
                          px-3.5
                          py-1.5
                          rounded-lg
                          border
                          border-outline-variant/20
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          sm:text-sm
                          text-on-surface-variant
                          font-medium
                        "
                        >
                          <Calendar
                            className="
                            w-4
                            h-4
                            shrink-0
                            text-primary
                          "
                            aria-hidden="true"
                          />

                          <span>
                            {new Date(
                              selectedItem.date
                            ).toLocaleDateString(
                              "ar-EG",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                {/* Full Description */}
                <div
                  className="
                    bg-surface-container/40
                    p-4
                    rounded-xl
                    border
                    border-outline-variant/20
                  "
                >
                  <h4
                    className="
                      text-xs
                      font-bold
                      text-on-surface-variant
                      mb-2
                    "
                  >
                    الوصف الكامل:
                  </h4>

                  <p
                    className="
                      text-on-surface
                      text-sm
                      sm:text-base
                      leading-relaxed
                      whitespace-pre-line
                    "
                  >
                    {selectedItem.description ||
                      "لا يوجد وصف متاح لهذا العنصر."}
                  </p>
                </div>
              </div>

              {/* =========================
                  Modal Footer
              ========================== */}
              <div
                className="
                  p-4
                  border-t
                  border-outline-variant/20
                  bg-surface-container-low/50
                  flex
                  justify-end
                "
              >
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="
                    px-6
                    py-2.5
                    rounded-xl
                    bg-primary
                    text-on-primary
                    text-xs
                    font-bold
                    shadow-xs
                    hover:opacity-90
                    transition-opacity
                  "
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


