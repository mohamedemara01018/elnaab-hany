"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { VideoOff, Play, X } from "lucide-react";
import { GetVideosResponse, VideoItem } from "@/types/video.types";
import { getMediaUrl } from "@/utils/functions.utils";
import EmptyState from "@/components/ui/Emptystate";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";
import defaultPoster from "@/public/help_people.jpg";
import generateVideoPoster from "../ui/generateVideoPoster";

interface VideosProps {
  data: GetVideosResponse | null;
}

/**
 * Utility function to transform various YouTube URLs into embeddable format.
 */
function getEmbedUrl(url: string): string {
  if (!url) return "";
  const cleanUrl = url.trim();

  if (cleanUrl.includes("watch?v=")) {
    return cleanUrl.replace("watch?v=", "embed/").split("&")[0];
  }
  if (cleanUrl.includes("youtu.be/")) {
    return cleanUrl.replace("youtu.be/", "youtube.com/embed/");
  }
  if (cleanUrl.includes("youtube.com/shorts/")) {
    return cleanUrl.replace("youtube.com/shorts/", "youtube.com/embed/");
  }
  return cleanUrl;
}

/**
 * Custom video component that dynamically generates a poster frame from video source.
 */
function AutoPosterVideo({ url, title }: { url: string; title: string }) {
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (url) {
      generateVideoPoster(url, 1.0)
        .then((posterUrl) => {
          if (isMounted) {
            setGeneratedPoster(posterUrl);
          }
        })
        .catch(() => {
          if (isMounted) {
            setGeneratedPoster(defaultPoster.src);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <video
      src={`${url}#t=0.1`}
      preload="metadata"
      poster={generatedPoster || defaultPoster.src}
      aria-label={title}
      className="w-full h-full object-cover opacity-80 group-hover/video:opacity-60 transition-opacity duration-300"
    />
  );
}

export function Videos({ data }: VideosProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Extract video list safely
  const videosList = useMemo<VideoItem[]>(() => {
    if (Array.isArray(data)) return data;
    if (data && "value" in data && Array.isArray(data.value)) {
      return data.value;
    }
    return [];
  }, [data]);

  const hasVideos = videosList.length > 0;

  return (
    <>
      <section id="videos" className="bg-surface-container-low py-20 md:py-28">
        <div className="wrapper">
          <span className="text-label-overline">لقاءات تلفزيونية وبرلمانية</span>
          <h2 className="text-headline-section mt-2 mb-9 max-w-3xl" style={{ fontSize: 32 }}>
            أحدث كلمات النائب عن مشاكل الدائرة
          </h2>

          {!hasVideos ? (
            <EmptyState
              icon={VideoOff}
              title="لا توجد فيديوهات متاحة حالياً"
              description="سيتم نشر أحدث الكلمات البرلمانية واللقاءات التلفزيونية للنائب فور توفرها."
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
              {videosList.map((item, index) => {
                const url = getMediaUrl(item.mediaUrl) || "";
                const title = item.title || "كلمة برلمانية";
                const hasValidVideo = Boolean(url && url.trim() !== "");
                const isYoutube =
                  hasValidVideo && (url.includes("youtube.com") || url.includes("youtu.be"));
                const numberLabel = String(index + 1).padStart(2, "0");

                return (
                  <motion.article
                    key={item.id ?? index}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="group bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="flex flex-col gap-3.5">
                      {/* Badge / Number Header */}
                      <div className="flex items-center justify-between">
                        <span className="font-display font-black text-xs px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                          {numberLabel}
                        </span>
                      </div>

                      {/* Video Preview Box with Overlay Play Button */}
                      <div
                        onClick={() => setSelectedVideo(item)}
                        className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/90 border border-outline-variant/20 cursor-pointer group/video flex items-center justify-center shadow-xs"
                      >
                        {hasValidVideo ? (
                          isYoutube ? (
                            <iframe
                              src={getEmbedUrl(url)}
                              title={title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full border-0 pointer-events-none opacity-80 group-hover/video:opacity-60 transition-opacity"
                            />
                          ) : (
                            <AutoPosterVideo url={url} title={title} />
                          )
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                              src="/700642161_122221074338346497_4382501221500797653_n.jpg"
                              alt={title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover opacity-80 group-hover/video:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* Interactive Floating Play Button Overlay */}
                        <div className="absolute w-14 h-14 rounded-full bg-primary/90 text-on-primary flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform duration-300 border border-white/20">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-12">
                        {title}
                      </h3>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="mt-5 pt-3 border-t border-outline-variant/20">
                      <button
                        type="button"
                        onClick={() => setSelectedVideo(item)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-all duration-200 border border-outline-variant/30"
                      >
                        <Play className="w-4 h-4 shrink-0 fill-current ml-0.5" />
                        <span>مشاهدة الفيديو</span>
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Video Modal Display */}
      <AnimatePresence>
        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 bg-surface-container-low/50">
                <h3 className="font-display text-lg font-bold text-on-surface line-clamp-1">
                  {selectedVideo.title || "عرض الفيديو"}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player Container */}
              <div className="p-6 overflow-y-auto flex flex-col gap-5">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-outline-variant/20 shadow-inner flex items-center justify-center">
                  {getMediaUrl(selectedVideo.mediaUrl) ? (
                    getMediaUrl(selectedVideo.mediaUrl).includes("youtube.com") ||
                      getMediaUrl(selectedVideo.mediaUrl).includes("youtu.be") ? (
                      <iframe
                        src={getEmbedUrl(getMediaUrl(selectedVideo.mediaUrl))}
                        title={selectedVideo.title || "فيديو"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <video
                        src={getMediaUrl(selectedVideo.mediaUrl)}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                    )
                  ) : (
                    <p className="text-on-surface-variant text-sm">عذراً، يتعذر تحميل مشغل الفيديو.</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}