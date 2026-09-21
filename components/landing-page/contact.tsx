"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import UserImage from "@/components/ui/UserImage";
import { CONTACT_CARDS, TEAM as FALLBACK_TEAM } from "@/lib/data";
import { HeroInfoData, GetHeroInfoResponse } from "@/types/hero.types";
import { EmployeeItem } from "@/types/employee.types";
import { employeeService } from "@/services/employee.service";
import { fadeUp, staggerContainer, revealViewport } from "@/lib/motion-variants";

// Brand icons fallback — inherit color via currentColor
function FacebookIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.86c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function WhatsappIcon({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.88.52 3.63 1.42 5.13L2 22l4.99-1.31A9.96 9.96 0 0 0 12.02 22C17.54 22 22 17.52 22 12S17.54 2 12.02 2Zm0 18.13c-1.7 0-3.29-.47-4.66-1.29l-.33-.2-3.09.81.83-3.02-.22-.31A8.13 8.13 0 0 1 3.85 12c0-4.5 3.67-8.15 8.17-8.15S20.15 7.5 20.15 12s-3.66 8.13-8.13 8.13Z" />
    </svg>
  );
}

function renderCardIcon(icon: ReactNode | string) {
  if (typeof icon === "string") {
    switch (icon) {
      case "mappin":
      case "📍":
        return <MapPin className="w-5 h-5 shrink-0" aria-hidden="true" />;
      case "phone":
      case "☎":
        return <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />;
      case "facebook":
      case "f":
        return <FacebookIcon size={20} />;
      case "whatsapp":
      case "💬":
        return <WhatsappIcon size={22} />;
      case "clock":
      case "◷":
        return <Clock className="w-5 h-5 shrink-0" aria-hidden="true" />;
      default:
        return null;
    }
  }
  return icon;
}

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
        icon: <MapPin className="w-5 h-5 shrink-0" aria-hidden="true" />,
        title: "العنوان",
        body: heroInfo?.officeLocation || heroInfo?.address || "مكتب النائب — برج افنان - مدينة كفر شكر",
        link: heroInfo?.locationURL
          ? { label: "فتح الموقع على الخريطة", href: heroInfo.locationURL }
          : { label: "فتح الخريطة", href: "https://maps.app.goo.gl/aYWMiooMkypRnM1z9" },
      },
      {
        icon: <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />,
        title: "الهاتف",
        body: `${heroInfo?.primaryPhone || "01024949496"} — متاح يومياً`,
        link: { label: "اتصل الآن", href: `tel:${heroInfo?.primaryPhone || "01024949496"}` },
      },
      {
        icon: <FacebookIcon size={20} />,
        title: "Facebook",
        body: "الصفحة الرسمية — تواصل معنا عبر Facebook",
        link: {
          label: "زيارة الصفحة",
          href: heroInfo?.facebookLing || "https://web.facebook.com/profile.php?id=61560394937903",
        },
      },
      {
        icon: <WhatsappIcon size={22} />,
        title: "WhatsApp",
        body: `${heroInfo?.whatsApp || "01114418110"} — تواصل معنا مباشرة`,
        link: {
          label: "فتح WhatsApp",
          href: `https://wa.me/${(heroInfo?.whatsApp || "01114418110").replace(/[^0-9]/g, "")}`,
        },
      },
      {
        icon: <Clock className="w-5 h-5 shrink-0" aria-hidden="true" />,
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
              {renderCardIcon(c.icon)}
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
                <span>{c.link.label.replace(/↗/g, "").trim()}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
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
                    <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                    <span dir="ltr">{emp.phone}</span>
                  </a>
                )}

                {emp.email && (
                  <a
                    href={`mailto:${emp.email}`}
                    className="text-xs text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1.5 truncate"
                    title={emp.email}
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{emp.email}</span>
                  </a>
                )}
              </div>
            </motion.article>
          ))}
      </motion.div>
    </Section>
  );
}