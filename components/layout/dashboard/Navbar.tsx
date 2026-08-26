"use client";

import ToggleTheme from "@/components/ui/ToggleTheme";
import { Search, User } from "lucide-react";

type NavbarProps = {
    userName: string;
    userRole: string;
    HEADER_HEIGHT?: number;
};

export function Navbar({ userName, userRole, HEADER_HEIGHT = 70 }: NavbarProps) {
    return (
        <header
            style={{ height: `${HEADER_HEIGHT}px` }}
            className="fixed top-0 inset-s-0 inset-e-0 z-30 flex items-center justify-between px-6 md:px-10 border-b border-outline-variant bg-surface/80 backdrop-blur-md transition-all"
        >

        
            {/* تفاصيل المستخدم */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                    <User />
                </div>
                <div className="text-start">
                    <p className="text-body-small text-on-surface-variant leading-tight">{userRole}</p>
                    <p className="text-body-main font-semibold text-on-surface leading-tight">{userName}</p>
                </div>

            </div>

            <ToggleTheme />
        </header>
    );
}