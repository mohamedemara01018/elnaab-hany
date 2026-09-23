'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout';
import HeroManagementDashboardPage from './landing-dashboard/HeroManagementDashboardPage';
import LandingPage from './LandingPage';
import ComplaintsManagementPage from './employee-dashboard/ComplaintsManagementPage';
import { NAV_ITEMS_DEPUTY, NAV_ITEMS_EMPLOYEE_DASH, NAV_ITEMS_MAHER_DASH } from '@/utils/constant.utils';
import { UserRole } from '@/utils/enums.utils';
import { AppDispatch } from '@/store/store';
import { fetchMe, selectMeSlice } from '@/store/slices/auth/meSlice';
import Loading from '@/components/ui/Loading';
import DeputyComplaintsManagementPage from './deputy-dashboard/DeputyComplaintsManagementPage';

export default function HomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const { me, isLoading, initialized } = useSelector(selectMeSlice);

    useEffect(() => {
        if (!initialized && !isLoading) {
            dispatch(fetchMe());
        }
    }, [dispatch, initialized, isLoading]);

    if (isLoading || !initialized) {
        return <Loading />; // Render loading spinner if preferred
    }

    const userName = me?.name || 'مستخدم';
    switch (me?.role) {
        case UserRole.SOCIAL:
            return (
                <DashboardLayout
                    userName={userName}
                    userRole="المسؤول"
                    NAV_ITEMS={NAV_ITEMS_MAHER_DASH}
                >
                    <HeroManagementDashboardPage />
                </DashboardLayout>
            );

        case UserRole.ADMIN:
            return (
                <DashboardLayout
                    userName={userName}
                    userRole="نائب"
                    NAV_ITEMS={NAV_ITEMS_DEPUTY}
                >
                    <DeputyComplaintsManagementPage />
                </DashboardLayout>
            );

        case UserRole.EMPLOYEE:
            return (
                <DashboardLayout
                    userName={userName}
                    userRole="موظف"
                    NAV_ITEMS={NAV_ITEMS_EMPLOYEE_DASH}
                >
                    <ComplaintsManagementPage />
                </DashboardLayout>
            );

        default:
            return <LandingPage />;
    }
}