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
    Users,
    ClipboardList, // أيقونة قسم فريق العمل
    UserPlus,      // أيقونة إضافة/تسجيل موظف جديد
    Lock,          // أيقونة كلمة المرور
    Home,          // أيقونة الصفحة الرئيسية
} from "lucide-react";

export const NAV_ITEMS_MAHER_DASH = [
    { href: "/", label: "نظرة عامة", icon: LayoutGrid },
    { href: "/briefing-requests", label: "طلبات الإحاطة", icon: FileText },
    { href: "/achievements", label: "ما تم إنجازه", icon: CheckCircle2 },
    { href: "/events", label: "أحدث الزيارات والفعاليات", icon: CalendarCheck },
    { href: "/activities", label: "الأنشطة والفعاليات", icon: CalendarDays },
    { href: "/videos", label: "اللقاءات والفيديوهات", icon: Video },
    { href: "/change-password", label: "تغيير كلمة المرور", icon: Settings },
];

export const NAV_ITEMS_EMPLOYEE_DASH = [
    { href: "/", label: "كل الشكاوى", icon: ClipboardList },
    { href: "/change-password", label: "تغيير كلمة المرور", icon: Settings },
];

export const NAV_ITEMS_DEPUTY = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/register-employee", label: "تسجيل موظف جديد", icon: UserPlus },
    { href: "/employees-ranking", label: "تصنيف الموظفين", icon: CalendarCheck },
    { href: "/employees", label: "فريق العمل والموظفين", icon: Users },
    { href: "/change-password", label: "تغيير كلمة المرور", icon: Lock },
];

export const DURATION = 1500;