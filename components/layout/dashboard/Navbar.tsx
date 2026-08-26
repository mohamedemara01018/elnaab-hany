"use client";

import ToggleTheme from "@/components/ui/ToggleTheme";
import { User, Menu, X } from "lucide-react";

type NavbarProps = {
    userName: string;
    userRole: string;
    HEADER_HEIGHT?: number;
    isOpen?: boolean;
    onToggleSidebar?: () => void;
};

export function Navbar({
    userName,
    userRole,
    HEADER_HEIGHT = 70,
    isOpen,
    onToggleSidebar,
}: NavbarProps) {
    return (
        <header
            style={{ height: `${HEADER_HEIGHT}px` }}
            className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 border-b border-outline-variant bg-surface/80 backdrop-blur-md transition-all"
        >
            <div className="flex items-center gap-3">
                {/* زر القائمة للشاشات الصغيرة */}
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
                    className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-interactive transition-colors"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                {/* تفاصيل المستخدم */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                        <User size={20} />
                    </div>
                    <div className="text-start">
                        <p className="text-body-small text-on-surface-variant leading-tight">{userRole}</p>
                        <p className="text-body-main font-semibold text-on-surface leading-tight">{userName}</p>
                    </div>
                </div>
            </div>

            <ToggleTheme />
        </header>
    );
}