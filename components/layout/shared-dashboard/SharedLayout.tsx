'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { NAV_ITEMS_DEPUTY, NAV_ITEMS_EMPLOYEE_DASH, NAV_ITEMS_MAHER_DASH } from '@/utils/constant.utils';
import { UserRole } from '@/utils/enums.utils';
import { AppDispatch } from '@/store/store';
import { fetchMe, selectMeSlice } from '@/store/slices/auth/meSlice';
import Loading from '@/components/ui/Loading';

function SharedLayout({ children }: { children: ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const { me, isLoading, initialized } = useSelector(selectMeSlice);

    useEffect(() => {
        if (!initialized && !isLoading) {
            dispatch(fetchMe());
        }
    }, [dispatch, initialized, isLoading]);

    if (isLoading || !initialized) {
        return <Loading />;
    }

    const userName = me?.name || 'مستخدم';

    switch (me?.role) {
        case UserRole.SOCIAL:
            return (
                <DashboardLayout
                    userName={userName}
                    userRole="مسؤول التواصل"
                    NAV_ITEMS={NAV_ITEMS_MAHER_DASH}
                >
                    {children}
                </DashboardLayout>
            );

        case UserRole.ADMIN:
            return (
                <DashboardLayout
                    userName={userName}
                    userRole="المسؤول"
                    NAV_ITEMS={NAV_ITEMS_DEPUTY}
                >
                    {children}
                </DashboardLayout>
            );

        case UserRole.EMPLOYEE:
            return (
                <DashboardLayout
                    userName={userName}
                    userRole="موظف"
                    NAV_ITEMS={NAV_ITEMS_EMPLOYEE_DASH}
                >
                    {children}
                </DashboardLayout>
            );

        default:
            return <>{children}</>;
    }
}

export default SharedLayout;