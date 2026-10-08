'use client'
import PublicLayout from '@/components/layout/public/PublicLayout'
import React from 'react'


function layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <PublicLayout >
            <main>
                {children}
            </main>
        </PublicLayout>
    )
}

export default layout