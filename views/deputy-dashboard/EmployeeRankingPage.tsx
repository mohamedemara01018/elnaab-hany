"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { deputyService } from "@/services/deputy.service";
import type { EmployeeRankingItem } from "@/types/deputy.types";
import { EmployeeRankingTable } from "@/components/deputy-dashboard/employees-ranking-page/EmployeeRankingTable";

export default function EmployeeRankingPage() {
    const [employees, setEmployees] = useState<EmployeeRankingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRanking = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await deputyService.getEmployeesRanking();
            const items = res?.value?.employees ?? [];
            // Defensive sort in case the API doesn't guarantee order.
            setEmployees([...items].sort((a, b) => a.rank - b.rank));
        } catch (err) {
            console.error("فشل في جلب ترتيب الموظفين:", err);
            setError("تعذّر تحميل ترتيب الموظفين. حاول مرة أخرى.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRanking();
    }, [fetchRanking]);

    return (
        <div className="flex-1 flex flex-col gap-6 px-6 md:px-10 pb-10">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-headline-section text-on-surface" style={{ fontSize: 28 }}>
                        ترتيب وتصنيف الموظفين حسب الإنجاز
                    </h1>
                    <p className="text-body-small text-on-surface-variant mt-1">
                        مقارنة حية بعدد الحالات المسجلة
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fetchRanking}
                    disabled={loading}
                    className="btn-outline flex items-center gap-2 px-4 py-2 text-body-small font-semibold disabled:opacity-50"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>تحديث</span>
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-card border border-error/30 bg-error-container/30 text-error px-4 py-3 text-body-small">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <EmployeeRankingTable employees={employees} loading={loading} />
        </div>
    );
}