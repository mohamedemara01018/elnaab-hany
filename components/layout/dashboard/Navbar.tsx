"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { fetchMe, selectMeSlice } from "@/store/slices/auth/meSlice";
import ToggleTheme from "@/components/ui/ToggleTheme";
import { UserMenu } from "@/components/ui/UserMenu";

type NavbarProps = {
    userName?: string;
    userRole?: string;
    HEADER_HEIGHT?: number;
    isOpen?: boolean;
    onToggleSidebar?: () => void;
};

export function Navbar({
    userName: initialUserName,
    userRole: initialUserRole,
    HEADER_HEIGHT = 70,
    isOpen,
    onToggleSidebar,
}: NavbarProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { me, isLoading, initialized } = useSelector(selectMeSlice);

    useEffect(() => {
        if (!initialized && !isLoading) {
            dispatch(fetchMe());
        }
    }, [dispatch, initialized, isLoading]);

    const displayName = me?.name || initialUserName || "مستخدم";
    const displayRole = me?.department || me?.role || initialUserRole || "المسؤول";

    return (
        <header
            style={{ height: `${HEADER_HEIGHT}px` }}
            className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 border-b border-outline-variant bg-surface/80 backdrop-blur-md transition-all"
        >
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
                    className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-interactive transition-colors"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                <UserMenu
                    displayName={displayName}
                    displayRole={displayRole}
                    imageUrl={me?.imageUrl}
                />
            </div>

            <ToggleTheme />
        </header>
    );
}