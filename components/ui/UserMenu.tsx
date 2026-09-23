"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut, KeyRound, ChevronDown, UserCheck } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { clearMe, selectMeSlice } from "@/store/slices/auth/meSlice";
import { UserRole } from "@/utils/enums.utils";

interface UserMenuProps {
    displayName: string;
    displayRole: string;
    imageUrl?: string | null;
}

export function UserMenu({ displayName, displayRole, imageUrl }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { me } = useSelector(selectMeSlice);
    const router = useRouter();
    const toggleMenu = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        dispatch(clearMe());
        router.replace("/login");
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="flex items-center gap-3 p-1.5 rounded-interactive hover:bg-surface-container transition-colors focus:outline-none"
            >
                <div className="relative w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0 overflow-hidden border border-outline-variant">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={displayName}
                            fill
                            sizes="36px"
                            className="object-cover"
                        />
                    ) : (
                        <User size={20} />
                    )}
                </div>
                <div className="text-start hidden sm:block">
                    <p className="text-body-small text-on-surface-variant leading-tight">
                        {displayRole}
                    </p>
                    <p className="text-body-main font-semibold text-on-surface leading-tight">
                        {displayName}
                    </p>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-on-surface-variant transition-transform duration-200 hidden sm:block ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-interactive bg-surface border border-outline-variant shadow-lg py-2 z-50 transition-all">
                    <div className="px-4 py-2 border-b border-outline-variant sm:hidden">
                        <p className="text-body-main font-semibold text-on-surface">
                            {displayName}
                        </p>
                        <p className="text-body-small text-on-surface-variant">
                            {displayRole}
                        </p>
                    </div>

                    {me?.role == UserRole.EMPLOYEE && <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-body-main text-on-surface hover:bg-surface-container transition-colors"
                    >
                        <span>الملف الشخصي</span>
                        <UserCheck size={18} />
                    </Link>
                    }
                    <Link
                        href="/change-password"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-body-main text-on-surface hover:bg-surface-container transition-colors"
                    >
                        <span>تغيير كلمة المرور</span>
                        <KeyRound size={18} />
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-body-main text-error hover:bg-error/10 transition-colors font-semibold border-t border-outline-variant mt-1 pt-2.5"
                    >
                        <span>تسجيل الخروج</span>
                        <LogOut size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}