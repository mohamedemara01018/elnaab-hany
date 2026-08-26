/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

export interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface SidebarProps {
    NAV_ITEMS: NavItem[];
    HEADER_HEIGHT?: number;
    SIDEBAR_WIDTH?: number;
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({
    NAV_ITEMS,
    HEADER_HEIGHT = 70,
    SIDEBAR_WIDTH = 256,
    isOpen = false,
    onClose,
}: SidebarProps) {
    const pathname = usePathname();

    useEffect(() => {
        if (onClose) onClose();
    }, [pathname]);

    return (
        <>
            {/* Backdrop Overlay - z-40 */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Drawer - z-50 on mobile, lower on desktop */}
            <aside
                style={{
                    top: `${HEADER_HEIGHT}px`,
                    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                }}
                className={`fixed right-0 z-40 lg:z-20 w-70 lg:w-[${SIDEBAR_WIDTH}px] flex flex-col border-e border-outline-variant bg-surface py-6 px-4 overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
                    }`}
                aria-label="التنقل الرئيسي"
            >
                <nav className="flex flex-col gap-1.5">
                    {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={[
                                    "flex items-center justify-between gap-3 rounded-interactive px-4 py-3 transition-colors",
                                    "text-body-main",
                                    active
                                        ? "bg-primary text-on-primary font-semibold"
                                        : "text-on-surface-variant hover:bg-surface-container",
                                ].join(" ")}
                                aria-current={active ? "page" : undefined}
                            >
                                <span>{label}</span>
                                <Icon size={18} strokeWidth={2} />
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}