"use client";

import React from "react";
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
}

export function Sidebar({
    NAV_ITEMS,
    HEADER_HEIGHT = 70,
    SIDEBAR_WIDTH = 256,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            style={{
                width: `${SIDEBAR_WIDTH}px`,
                top: `${HEADER_HEIGHT}px`,
                height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            }}
            className="flex md:flex-col fixed inset-s-0 border-e border-outline-variant bg-surface py-6 px-4 z-20 overflow-y-auto"
            aria-label="التنقل الرئيسي"
        >
            {/* عناصر التنقل */}
            <nav className="flex flex-col gap-1.5">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname == href


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
    );
}