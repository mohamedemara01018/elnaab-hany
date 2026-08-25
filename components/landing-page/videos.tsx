"use client";

import { motion } from "motion/react";
import { VideoPlaceholder } from "@/components/ui/media-placeholder";
import { VIDEOS } from "@/lib/data";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";

export function Videos() {
  return (
    <section id="videos" className="bg-surface-container-low py-20 md:py-28">
      <div className="wrapper">
        <span className="text-label-overline">لقاءات تلفزيونية وبرلمانية</span>
        <h2 className="text-headline-section mt-2 mb-9 max-w-3xl" style={{ fontSize: 32 }}>
          أحدث كلمات النائب عن مشاكل الدائرة
        </h2>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {VIDEOS.map((v) => (
            <motion.article
              key={v.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="card flex flex-col gap-2.5"
            >
              <h3 className="text-title-card">{v.title}</h3>
              <video
                src="https://www.pexels.com/download/video/36017391/"
                controls
                preload="none"
                aria-label={v.title}
                className="rounded-md overflow-hidden aspect-video w-full object-cover"
              ></video>
              {/* <VideoPlaceholder label={v.title} /> */}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
