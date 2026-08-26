import {
    LayoutGrid,
    FolderCog,
    MessagesSquare,
    CalendarDays,
    Settings,
    Video,
    FileText, // استيراد أيقونة طلبات الإحاطة
} from "lucide-react";

export const NAV_ITEMS_DASH = [
    { href: "/", label: "نظرة عامة", icon: LayoutGrid },
    { href: "/site-management", label: "إدارة الموقع", icon: FolderCog },
    { href: "/requests", label: "الشكاوى والطلبات", icon: MessagesSquare },
    { href: "/briefing-requests", label: "طلبات الإحاطة", icon: FileText }, // رابط طلبات الإحاطة الجديد
    { href: "/activities", label: "الأنشطة والفعاليات", icon: CalendarDays },
    { href: "/videos", label: "اللقاءات والفيديوهات", icon: Video },
    { href: "/settings", label: "الإعدادات", icon: Settings },
];