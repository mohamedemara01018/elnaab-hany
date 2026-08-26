"use client";

import { useState } from "react";
import { motion, AnimatePresence, TargetAndTransition } from "motion/react";
import { NAV_LINKS } from "@/lib/data";
import ToggleTheme from "../../ui/ToggleTheme";
import UserImage from "../../ui/UserImage";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Animation settings for the desktop & mobile links
  const linkHoverAnimation: TargetAndTransition = {
    scale: 1.05,
    y: -2,
    transition: { type: "spring", stiffness: 400, damping: 17 }
  };
  const linkTapAnimation = { scale: 0.95 };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant"
    >
      <div className="wrapper flex items-center justify-between gap-4 py-4 relative">
        <a href="#home" aria-label="الصفحة الرئيسية" className="flex gap-4 items-center justify-center">
          <UserImage avatarUrl="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" firstName="هاني" lastName="شحاتة" className="w-10 h-10" />
          <div className="flex flex-col">
            <strong className="font-display text-base">النائب هاني شحاتة</strong>
            <small className="text-xs text-on-surface-variant">الموقع الرسمي</small>
          </div>
        </a>

        <div className="flex items-center gap-3 md:order-last">
          <ToggleTheme />

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="فتح القائمة"
            aria-expanded={menuOpen}
            className="md:hidden border-none bg-transparent text-2xl text-on-surface"
          >
            ☰
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
                  whileHover={{ x: -6 }} // Moves slightly left for RTL layout hover
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