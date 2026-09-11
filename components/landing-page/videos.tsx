import Image from "next/image";
import { motion } from "motion/react";
import { VideoOff, Play } from "lucide-react";
import { GetVideosResponse } from "@/types/video.types";
import { getMediaUrl } from "@/utils/functions.utils";
import EmptyState from "@/components/ui/Emptystate";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";

interface VideosProps {
  data: GetVideosResponse | null;
}

export function Videos({ data }: VideosProps) {
  // Safely extract video list from response
  const videosList = Array.isArray(data)
    ? data
    : data && "value" in data && Array.isArray(data.value)
      ? data.value
      : null;

  const hasVideos = Array.isArray(videosList) && videosList.length > 0;

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    // eslint-disable-next-line prefer-const
    let cleanUrl = url.trim();

    // Handle youtube.com/watch?v=ID
    if (cleanUrl.includes("watch?v=")) {
      return cleanUrl.replace("watch?v=", "embed/").split("&")[0];
    }
    // Handle youtu.be/ID
    if (cleanUrl.includes("youtu.be/")) {
      return cleanUrl.replace("youtu.be/", "youtube.com/embed/");
    }
    // Handle youtube.com/shorts/ID
    if (cleanUrl.includes("youtube.com/shorts/")) {
      return cleanUrl.replace("youtube.com/shorts/", "youtube.com/embed/");
    }
    return cleanUrl;
  };

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
                    <span className="text-xs font-bold text-primary px-3 py-1 rounded-xl bg-primary/10 border border-primary/20">
                      🎥 كلمة برلمانية
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
                      <video
                        src={url}
                        controls
                        preload="none"
                        aria-label={title}
                        className="w-full h-full object-cover bg-black"
                      />
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center cursor-pointer">
                        <Image
                          src="/700642161_122221074338346497_4382501221500797653_n.jpg"
                          alt={title}
                          fill
                          className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <div className="w-13 h-13 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
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