"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, TargetAndTransition } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import ToggleTheme from "../../ui/ToggleTheme";
import UserImage from "../../ui/UserImage";
import { HeroInfoData } from "@/types/hero.types";
import { getMediaUrl } from "@/utils/functions.utils";
import { heroService } from "@/services/hero.service";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroInfo, setHeroInfo] = useState<HeroInfoData | null>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await heroService.getHeroInfo();
        if (response?.isSuccess && response?.value) {
          setHeroInfo(response.value);
        } else if (response?.value) {
          setHeroInfo(response.value);
        }
      } catch (error) {
        console.error("Failed to fetch hero info for Navbar:", error);
      }
    }

    fetchHero();
  }, []);

  const linkHoverAnimation: TargetAndTransition = {
    scale: 1.05,
    y: -2,
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };
  const linkTapAnimation = { scale: 0.95 };

  const fullName = heroInfo?.fullName || "النائب هاني شحاتة";
  const avatarUrl = getMediaUrl(heroInfo?.mediaUrl)

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant"
    >
      <div className="wrapper flex items-center justify-between gap-4 py-4 relative">
        <a href="#home" aria-label="الصفحة الرئيسية" className="flex gap-4 items-center justify-center">
          <UserImage
            avatarUrl={avatarUrl}
            fullName={fullName}
            className="w-10 h-10"
          />
          <div className="flex flex-col">
            <strong className="font-display text-base">{fullName}</strong>
            <small className="text-xs text-on-surface-variant">
              {heroInfo?.title || "الموقع الرسمي"}
            </small>
          </div>
        </a>

        <div className="flex items-center gap-3 md:order-last">
          <ToggleTheme />

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            className="md:hidden border-none bg-transparent p-1.5 text-on-surface cursor-pointer flex items-center justify-center"
          >
            {menuOpen ? <X className="w-6 h-6 shrink-0" aria-hidden="true" /> : <Menu className="w-6 h-6 shrink-0" aria-hidden="true" />}
          </button>
        </div>

        <nav aria-label="القائمة الرئيسية" className="hidden md:flex flex-row gap-6">
          {NAV_LINKS.map((l) => (
            <motion.a
              key={l.href}
              href={l.href}
              className="nav-link relative py-1 text-on-surface hover:text-primary transition-colors"
              whileHover={linkHoverAnimation}
              whileTap={linkTapAnimation}
            >
              {l.label}
            </motion.a>
          ))}
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              aria-label="القائمة الرئيسية"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden flex flex-col gap-4 absolute top-full inset-x-0 bg-surface p-4 border-t border-outline-variant overflow-hidden"
            >
              {NAV_LINKS.map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="nav-link py-1 text-on-surface hover:text-primary transition-colors"
                  whileHover={{ x: -6 }}
                  whileTap={linkTapAnimation}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}