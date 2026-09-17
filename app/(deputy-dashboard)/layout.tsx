'use client'
import { DashboardLayout } from '@/components/layout/dashboard/DashboardLayout'
import { NAV_ITEMS_DEPUTY } from '@/utils/constant.utils'
import React from 'react'


function layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <DashboardLayout userName="أدمن هاني شحاتة" userRole="المسؤول" NAV_ITEMS={NAV_ITEMS_DEPUTY}>
            {children}
        </DashboardLayout>
    )
}

export default layout