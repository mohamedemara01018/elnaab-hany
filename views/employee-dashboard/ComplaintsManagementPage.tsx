"use client";

import { useState } from "react";
import { CheckCircle2, Hourglass, FileText, Bell, Plus, Search } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard/DashboardLayout";
import { PageHeader } from "@/components/landing-dashboard/hero-management-dashboard-page/Pageheader";
import { StatCard } from "@/components/employee-dashboard/complaints-management-page/Statcard";
import { FilterSelect } from "@/components/employee-dashboard/complaints-management-page/Filterselect";
import { ComplaintRow, ComplaintsTable } from "@/components/employee-dashboard/complaints-management-page/ComplaintsTable";

// Empty for now — wire this up to real data once the API is ready.
const COMPLAINTS: ComplaintRow[] = [];

const NEW_COMPLAINTS_COUNT = 0;

export default function ComplaintsManagementPage() {
    const [rows] = useState<ComplaintRow[]>(COMPLAINTS);

    const stats = {
        done: rows.filter((r) => r.status === "done").length,
        inProgress: rows.filter((r) => r.status === "in_progress").length,
        newCount: rows.filter((r) => r.status === "new").length,
        total: rows.length,
    };

    return (
        <>
            <PageHeader breadcrumb="إدارة الموقع" title="الشكاوى والطلبات" />

            <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-10">
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="تم الإنجاز"
                        value={stats.done}
                        tone="success"
                        icon={<CheckCircle2 size={18} />}
                    />
                    <StatCard
                        label="قيد المتابعة"
                        value={stats.inProgress}
                        tone="warning"
                        icon={<Hourglass size={18} />}
                    />
                    <StatCard
                        label="شكاوى جديدة"
                        value={stats.newCount}
                        tone="info"
                        icon={<Bell size={18} />}
                    />
                    <StatCard
                        label="إجمالي الشكاوى"
                        value={stats.total}
                        tone="neutral"
                        icon={<FileText size={18} />}
                    />
                </div>

                {/* New complaints notice */}
                {NEW_COMPLAINTS_COUNT > 0 && (
                    <div className="flex items-center justify-between gap-4 rounded-card border border-primary/30 bg-primary-container/15 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-primary-container/60 text-on-primary-container flex items-center justify-center shrink-0">
                                <Bell size={17} />
                            </span>
                            <div>
                                <p className="text-body-main font-semibold text-on-surface">متابعة الشكاوى الجديدة</p>
                                <p className="text-body-small text-on-surface-variant">
                                    يوجد شكاوى جديدة تحتاج إلى توزيع ومراجعة.
                                </p>
                            </div>
                        </div>
                        <button type="button" className="btn-primary px-4 py-2 text-body-small font-semibold whitespace-nowrap">
                            عرض الجديدة
                        </button>
                    </div>
                )}

                {/* Header + filters + table */}
                <section className="card">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                        <div>
                            <h2 className="text-title-card text-on-surface" style={{ fontSize: 20 }}>
                                إدارة ومتابعة شكاوى المواطنين
                            </h2>
                            <p className="text-body-small text-on-surface-variant mt-1">
                                جميع الشكاوى والطلبات المقدَّمة من المواطنين عبر نموذج الموقع.
                            </p>
                        </div>

                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 mb-5">
                        <FilterSelect label="كل الجهات" options={["الجيزة", "الهرم", "العمرانية"]} />
                        <FilterSelect label="كل الحالات" options={["جديدة", "قيد المتابعة", "تم الإنجاز"]} />
                        <FilterSelect label="جميع الموظفين" options={["محمود", "إيمان", "أحمد"]} />
                        <div className="relative col-span-2 md:col-span-1">
                            <input
                                type="text"
                                placeholder="ابحث باسم المواطن أو الهاتف أو الرقم القومي..."
                                className="input-field w-full py-2.5 ps-3 pe-9 text-body-small text-on-surface"
                            />
                            <span className="absolute inset-y-0 inset-e-3 flex items-center text-on-surface-variant">
                                <Search size={15} />
                            </span>
                        </div>
                    </div>

                    <ComplaintsTable rows={rows} />
                </section>
            </div>
        </>
    );
}