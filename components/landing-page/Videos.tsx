"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { VideoOff, Play, Video } from "lucide-react";
import { GetVideosResponse } from "@/types/video.types";
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
      // Capture frame at 1.0 second mark
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
      controls
      preload="metadata"
      poster={generatedPoster || defaultPoster.src}
      aria-label={title}
      className="w-full h-full object-cover bg-black"
    />
  );
}

export function Videos({ data }: VideosProps) {
  // Safely extract video list from response
  const videosList = Array.isArray(data)
    ? data
    : data && "value" in data && Array.isArray(data.value)
      ? data.value
      : null;

  const hasVideos = Array.isArray(videosList) && videosList.length > 0;

  return (
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
              const title = item.title || "كلمة النائب";
              const hasValidVideo = Boolean(url && url.trim() !== "");
              const isYoutube =
                hasValidVideo && (url.includes("youtube.com") || url.includes("youtu.be"));

              const embedUrl = isYoutube ? getEmbedUrl(url) : "";

              return (
                <motion.article
                  key={item.id ?? index}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="card flex flex-col gap-3.5 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 inline-flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>كلمة برلمانية</span>
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold line-clamp-2 min-h-12 text-on-surface group-hover:text-primary transition-colors leading-snug">
                    {title}
                  </h3>

                  <div className="relative rounded-xl overflow-hidden aspect-video w-full bg-surface-container border border-outline-variant/20 shadow-xs">
                    {isYoutube ? (
                      <iframe
                        src={embedUrl}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : hasValidVideo ? (
                      <AutoPosterVideo url={url} title={title} />
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center cursor-pointer">
                        <Image
                          src="/700642161_122221074338346497_4382501221500797653_n.jpg"
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={20} className="fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}