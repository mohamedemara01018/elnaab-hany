'use client'
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import HeroManagementDashboardPage from './HeroManagementDashboardPage'
    ;
import LandingPage from './LandingPage';
import { NAV_ITEMS_DASH } from '@/utils/constant.utils';




function HomePage() {
    const role = 'admin'
    switch (role) {
        case 'admin':
            return <DashboardLayout userName="أدمن هاني شحاتة" userRole="المسؤول" NAV_ITEMS={NAV_ITEMS_DASH}>
                <HeroManagementDashboardPage />
            </DashboardLayout>
        default:
            return (<LandingPage />);
    }

}

export default HomePage