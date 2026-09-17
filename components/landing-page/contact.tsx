"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import UserImage from "@/components/ui/UserImage";
import { CONTACT_CARDS, TEAM as FALLBACK_TEAM } from "@/lib/data";
import { HeroInfoData, GetHeroInfoResponse } from "@/types/hero.types";
import { EmployeeItem } from "@/types/employee.types";
import { employeeService } from "@/services/employee.service";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";

interface ContactProps {
  data?: HeroInfoData | GetHeroInfoResponse | null;
}

export function Contact({ data }: ContactProps) {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await employeeService.getAllEmployees();
        if (response?.isSuccess && Array.isArray(response.value)) {
          setEmployees(response.value);
        }
      } catch (error) {
        console.error("Failed to load employees for contact team section:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

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

  const displayTeam: EmployeeItem[] =
    employees.length > 0
      ? employees
      : FALLBACK_TEAM.map((t, idx) => ({
        id: String(idx),
        fullName: t.name,
        email: "",
        about: t.role,
        phone: t.phone,
        imageUrl: null,
        departmentName: "مكتب الخدمات",
        organizations: [],
      }));

  return (
    <Section id="contact">
      <SectionTitle
        eyebrow="تواصل معنا"
        title="نحن"
        emphasis="قريبون منك"
        blurb="تواصل مباشرة مع مكتب النائب أو مع أحد أعضاء فريق الخدمات."
      />

      {/* Main Contact Cards */}
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

      {/* Team Header */}
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

      {/* Team Cards List */}
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loadingEmployees
          ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-container-low h-56 rounded-2xl border border-outline-variant/30 p-6" />
          ))
          : displayTeam.map((emp) => (
            <motion.article
              key={emp.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="card flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 bg-surface-container-lowest border-outline-variant/30 hover:border-primary/40 text-on-surface shadow-sm hover:shadow-xl"
            >
              <div className="flex flex-col gap-3">
                {/* Avatar, Name, and Department */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserImage
                      fullName={emp.fullName}
                      avatarUrl={emp.imageUrl}
                      className="w-12 h-12 text-base font-bold border border-outline-variant/20 shrink-0"
                    />
                    <div>
                      <h3 className="font-display text-lg font-bold text-on-surface leading-snug">
                        {emp.fullName}
                      </h3>
                      {emp.departmentName && (
                        <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          {emp.departmentName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* About Details */}
                {emp.about && (
                  <p className="text-sm leading-relaxed text-on-surface-variant line-clamp-3">
                    {emp.about}
                  </p>
                )}

                {/* Organizations Badges */}
                {emp.organizations && emp.organizations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {emp.organizations.map((org, index) => (
                      <span
                        key={index}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium"
                      >
                        {org}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Contact Details */}
              <div className="mt-5 pt-3.5 border-t border-outline-variant/30 flex flex-col gap-1.5">
                {emp.phone && (
                  <a
                    href={`tel:${emp.phone}`}
                    className="font-bold text-sm inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <span>☎</span>
                    <span dir="ltr">{emp.phone}</span>
                  </a>
                )}

                {emp.email && (
                  <a
                    href={`mailto:${emp.email}`}
                    className="text-xs text-on-surface-variant hover:text-primary transition-colors truncate"
                    title={emp.email}
                  >
                    ✉ {emp.email}
                  </a>
                )}
              </div>
            </motion.article>
          ))}
      </motion.div>
    </Section>
  );
}