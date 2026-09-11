import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { CONTACT_CARDS, TEAM } from "@/lib/data";
import { HeroInfoData, GetHeroInfoResponse } from "@/types/hero.types";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";

interface ContactProps {
  data?: HeroInfoData | GetHeroInfoResponse | null;
}

export function Contact({ data }: ContactProps) {
  const heroInfo: HeroInfoData | null =
    data && "value" in data ? (data.value as HeroInfoData) : (data as HeroInfoData | null);

  const hasHeroContact = Boolean(
    heroInfo &&
    (heroInfo.officeLocation ||
      heroInfo.address ||
      heroInfo.primaryPhone ||
      heroInfo.facebookLing ||
      heroInfo.whatsApp ||
      heroInfo.appointment)
  );

  const contactCards = hasHeroContact
    ? [
      {
        icon: "📍",
        title: "العنوان",
        body: heroInfo?.officeLocation || heroInfo?.address || "مكتب النائب — برج افنان - مدينة كفر شكر",
        link: heroInfo?.locationURL
          ? { label: "فتح الموقع على الخريطة ↗", href: heroInfo.locationURL }
          : { label: "فتح الخريطة ↗", href: "https://maps.app.goo.gl/aYWMiooMkypRnM1z9" },
      },
      {
        icon: "☎",
        title: "الهاتف",
        body: `${heroInfo?.primaryPhone || "01024949496"} — متاح يومياً`,
        link: { label: "اتصل الآن", href: `tel:${heroInfo?.primaryPhone || "01024949496"}` },
      },
      {
        icon: "f",
        title: "Facebook",
        body: "الصفحة الرسمية — تواصل معنا عبر Facebook",
        link: {
          label: "زيارة الصفحة ↗",
          href: heroInfo?.facebookLing || "https://web.facebook.com/profile.php?id=61560394937903",
        },
      },
      {
        icon: "💬",
        title: "WhatsApp",
        body: `${heroInfo?.whatsApp || "01114418110"} — تواصل معنا مباشرة`,
        link: {
          label: "فتح WhatsApp ↗",
          href: `https://wa.me/${(heroInfo?.whatsApp || "01114418110").replace(/[^0-9]/g, "")}`,
        },
      },
      {
        icon: "◷",
        title: "مواعيد التواصل",
        body: heroInfo?.appointment || "يومياً — 1:00 ظهراً - 10:00 مساءً",
      },
    ]
    : CONTACT_CARDS;

  return (
    <Section id="contact">
      <SectionTitle
        eyebrow="تواصل معنا"
        title="نحن"
        emphasis="قريبون منك"
        blurb="تواصل مباشرة مع مكتب النائب أو مع أحد أعضاء فريق الخدمات."
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        {contactCards.map((c, index) => (
          <motion.div
            key={c.title + index}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="card text-center flex flex-col items-center gap-3 p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
          >
            <div className="w-13 h-13 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shadow-xs">
              {c.icon}
            </div>
            <h3 className="font-display text-lg font-bold text-on-surface">{c.title}</h3>
            <p className="text-body-small text-on-surface-variant/90 text-sm leading-relaxed max-w-xs">
              {c.body}
            </p>
            {c.link && (
              <a
                href={c.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary mt-1 border-primary/30 hover:bg-primary hover:text-on-primary transition-all rounded-xl"
              >
                {c.link.label}
              </a>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="text-center mb-9"
      >
        <span className="text-primary font-bold text-xs uppercase tracking-wider">فريق الخدمات</span>
        <h3 className="font-display text-2xl md:text-3xl font-bold mt-1.5 text-on-surface">
          فريق <em className="font-decorative not-italic text-primary">مكتب النائب</em>
        </h3>
        <p className="text-body-main text-sm text-on-surface-variant mt-2">
          للتواصل والمتابعة مع المسؤول المختص حسب نوع الطلب.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {TEAM.map((t) => (
          <motion.article
            key={t.n}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`card flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${t.office
                ? "bg-primary text-on-primary border-primary shadow-lg"
                : "bg-surface-container-lowest border-outline-variant/30 hover:border-primary/40 text-on-surface shadow-sm hover:shadow-xl"
              }`}
          >
            <div className="flex flex-col gap-2">
              <span
                className={`font-display font-black text-xs px-2.5 py-0.5 rounded-lg w-fit ${t.office ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                  }`}
              >
                {t.n}
              </span>
              <h3 className="font-display text-lg font-bold mt-1">{t.name}</h3>
              <p className={`text-sm leading-relaxed ${t.office ? "text-white/90" : "text-on-surface-variant"}`}>
                {t.role}
              </p>
            </div>

            <div className="mt-4 pt-3.5 border-t border-current/15 flex items-center justify-between">
              <a
                href={`tel:${t.phone}`}
                className={`font-bold text-sm inline-flex items-center gap-1.5 hover:underline ${t.office ? "text-white" : "text-primary"
                  }`}
              >
                ☎ {t.phone}
              </a>
              {t.office && <span className="text-xs bg-white/25 px-2.5 py-1 rounded-md">المكتب الرئيسي</span>}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}