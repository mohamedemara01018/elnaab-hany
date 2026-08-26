import type { ReactNode } from "react";
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
    return (
        <div dir="rtl" className="min-h-dvh bg-surface-container-low">
            <Navbar
                userName={userName!}
                userRole={userRole!}
                HEADER_HEIGHT={HEADER_HEIGHT}
            />

            <Sidebar
                NAV_ITEMS={NAV_ITEMS}
                HEADER_HEIGHT={HEADER_HEIGHT}
                SIDEBAR_WIDTH={SIDEBAR_WIDTH}
            />

            <main
                style={{
                    marginRight: `${SIDEBAR_WIDTH}px`,
                    paddingTop: `${HEADER_HEIGHT}px`,
                }}
                className="min-h-dvh flex flex-col transition-all duration-200 "
            >
                <div className="p-6 flex-1 flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}