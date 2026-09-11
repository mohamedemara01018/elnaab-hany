
'use client';

import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import HeroManagementDashboardPage from './landing-dashboard/HeroManagementDashboardPage';
import LandingPage from './LandingPage';
import { NAV_ITEMS_EMPLOYEE_DASH, NAV_ITEMS_MAHER_DASH } from '@/utils/constant.utils';
import ComplaintsManagementPage from './employee-dashboard/ComplaintsManagementPage';

enum RoleType {
    ADMIN = 'admin',
    DEPUTY = 'deputy',
    LANDING_DASH = 'landing_dash',
    LANDING = 'landing',
    EMPLOYEE = 'employee',
}

export default function HomePage() {

    // أو الإبقاء على const مع توضيح النوع المباشر
    const currentRole: RoleType = RoleType.LANDING as RoleType;

    switch (currentRole) {
        case RoleType.LANDING_DASH:
            return (
                <DashboardLayout
                    userName="أدمن هاني شحاتة"
                    userRole="المسؤول"
                    NAV_ITEMS={NAV_ITEMS_MAHER_DASH}
                >
                    <HeroManagementDashboardPage />
                </DashboardLayout>
            );

        case RoleType.DEPUTY:
            return (
                <DashboardLayout
                    userName="أدمن هاني شحاتة"
                    userRole="المسؤول"
                    NAV_ITEMS={[]}
                >
                    <div>deputy</div>
                </DashboardLayout>
            );

        case RoleType.EMPLOYEE:
            return (
                <DashboardLayout
                    userName="أدمن هاني شحاتة"
                    userRole="المسؤول"
                    NAV_ITEMS={NAV_ITEMS_EMPLOYEE_DASH}
                >
                    <ComplaintsManagementPage />
                </DashboardLayout>
            );
        default:
            return <LandingPage />;
    }
}