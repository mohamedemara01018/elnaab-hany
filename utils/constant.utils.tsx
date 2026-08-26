import {
    LayoutGrid,
    FolderCog,
    MessagesSquare,
    CalendarDays,
    Settings,
    Video,
    FileText,
    CalendarCheck,
    CheckCircle2,
    Users, // أيقونة قسم فريق العمل
} from "lucide-react";

export const NAV_ITEMS_DASH = [
    { href: "/", label: "نظرة عامة", icon: LayoutGrid },
    { href: "/briefing-requests", label: "طلبات الإحاطة", icon: FileText },
    { href: "/achievements", label: "ما تم إنجازه", icon: CheckCircle2 },
    { href: "/team", label: "فريق العمل", icon: Users }, // رابط قسم فريق مكتب النائب الجديد
    { href: "/events", label: "أحدث الزيارات والفعاليات", icon: CalendarCheck },
    { href: "/activities", label: "الأنشطة والفعاليات", icon: CalendarDays },
    { href: "/videos", label: "اللقاءات والفيديوهات", icon: Video },
    { href: "/settings", label: "الإعدادات", icon: Settings },
];