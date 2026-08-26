"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { LucideIcon } from "lucide-react";

const HEADER_HEIGHT = 70;
const SIDEBAR_WIDTH = 256;

type DashboardLayoutProps = {
    children: ReactNode;
    userName?: string;
    userRole?: string;
    NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[];
};

export function DashboardLayout({ children, userName, userRole, NAV_ITEMS }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div dir="rtl" className="min-h-dvh bg-surface-container-low overflow-x-hidden">
            <Navbar
                userName={userName!}
                userRole={userRole!}
                HEADER_HEIGHT={HEADER_HEIGHT}
                isOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
            />

            <Sidebar
                NAV_ITEMS={NAV_ITEMS}
                HEADER_HEIGHT={HEADER_HEIGHT}
                SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            <main
                style={{
                    paddingTop: `${HEADER_HEIGHT}px`,
                }}
                className="min-h-dvh flex flex-col transition-all duration-200 mr-0 lg:mr-[256px] w-full lg:w-[calc(100%-256px)]"
            >
                <div className="p-4 sm:p-6 flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}