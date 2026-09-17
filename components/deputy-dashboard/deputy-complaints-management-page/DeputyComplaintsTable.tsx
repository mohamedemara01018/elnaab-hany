"use client";

import React from "react";
import { Eye, Inbox } from "lucide-react";
import { StatusBadge } from "@/components/employee-dashboard/complaints-management-page/Statusbadge";
import { ComplaintRow } from "@/types/deputy.types";

interface DeputyComplaintsTableProps {
    rows: ComplaintRow[];
    loading: boolean;
    onView: (row: ComplaintRow) => void;
}

export const DeputyComplaintsTable: React.FC<DeputyComplaintsTableProps> = ({
    rows,
    loading,
    onView,
}) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12 text-on-surface-variant text-body-medium">
                جاري تحميل البيانات...
            </div>
        );
    }

    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                <Inbox size={48} className="mb-2 opacity-50" />
                <p className="text-body-medium font-semibold">لا توجد شكاوى أو طلبات مطابقة</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-card border border-outline-variant">
            <table className="w-full text-start text-body-small">
                <thead className="bg-surface-variant/50 text-on-surface font-semibold">
                    <tr>
                        <th className="px-4 py-3 text-start">المواطن</th>
                        <th className="px-4 py-3 text-start">الهاتف</th>
                        <th className="px-4 py-3 text-start">الرقم القومي</th>
                        <th className="px-4 py-3 text-start">النوع</th>
                        <th className="px-4 py-3 text-start">الجهة المختصة</th>
                        <th className="px-4 py-3 text-start">التاريخ</th>
                        <th className="px-4 py-3 text-start">الموظف المسؤول</th>
                        <th className="px-4 py-3 text-start">الحالة</th>
                        <th className="px-4 py-3 text-center">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 bg-surface">
                    {rows.map((row) => (
                        <tr key={row.id} className="hover:bg-surface-variant/20 transition-colors">
                            <td className="px-4 py-3 font-medium text-on-surface">{row.citizenName}</td>
                            <td className="px-4 py-3 text-on-surface-variant">{row.phone}</td>
                            <td className="px-4 py-3 text-on-surface-variant">{row.nationalId}</td>
                            <td className="px-4 py-3 text-on-surface font-medium">{row.requestType}</td>
                            <td className="px-4 py-3 text-on-surface-variant">{row.jurisdiction}</td>
                            <td className="px-4 py-3 text-on-surface-variant">{row.date}</td>
                            <td className="px-4 py-3 text-on-surface-variant">
                                {row.employees && row.employees.length > 0 ? (
                                    <div className="flex flex-wrap items-center gap-1.5 max-w-[220px]">
                                        {row.employees.slice(0, 2).map((emp, idx) => (
                                            <span
                                                key={`${row.id}-${emp.employeeId ?? idx}`}
                                                className="inline-flex items-center rounded-full bg-secondary-container/60 text-on-secondary-container px-2.5 py-1 text-label-caption font-semibold whitespace-nowrap"
                                                title={emp.fullName}
                                            >
                                                {emp.fullName || "-"}
                                            </span>
                                        ))}
                                        {row.employees.length > 2 && (
                                            <span
                                                className="inline-flex items-center rounded-full bg-surface-container-high text-on-surface-variant px-2 py-1 text-label-caption font-semibold"
                                                title={row.employees
                                                    .slice(2)
                                                    .map((e) => e.fullName)
                                                    .join("، ")}
                                            >
                                                +{row.employees.length - 2}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span>-</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={row.status} />
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    type="button"
                                    onClick={() => onView(row)}
                                    className="p-1.5 rounded-lg text-primary hover:bg-primary-container/20 transition-colors"
                                    title="عرض التفاصيل"
                                >
                                    <Eye size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};