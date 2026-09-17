'use client'
import SharedLayout from '@/components/layout/shared-dashboard/SharedLayout'
function layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <SharedLayout>
            {children}
        </SharedLayout>
    )
}

export default layout