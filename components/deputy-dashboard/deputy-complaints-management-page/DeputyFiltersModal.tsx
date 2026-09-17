"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ComplaintPriority } from "@/types/deputy.types";

// TODO: replace with real endpoints once available
// e.g. deputyService.getDepartments() / deputyService.getOrganizations()
const DEPARTMENT_OPTIONS = [
    { id: 1, label: "قطاع العلاقات العامة" },
    { id: 2, label: "قطاع المتابعة الميدانية والاتصال الحكومي" },
    { id: 3, label: "قطاع الشؤون القانونية" },
];

const ORGANIZATION_OPTIONS = [
    { id: 101, label: "مجلس النواب المصري" },
    { id: 204, label: "ديوان عام محافظة القليوبية" },
    { id: 310, label: "مديرية الشؤون الصحية بالقليوبية" },
];

const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
    [ComplaintPriority.Low]: "منخفضة",
    [ComplaintPriority.Medium]: "متوسطة",
    [ComplaintPriority.High]: "عالية",
    [ComplaintPriority.Critical]: "حرجة",
};

export type DeputyAdvancedFilters = {
    priority: string; // "all" | ComplaintPriority as string
    departmentId: string; // "all" | id as string
    organizationId: string; // "all" | id as string
};

export const EMPTY_ADVANCED_FILTERS: DeputyAdvancedFilters = {
    priority: "all",
    departmentId: "all",
    organizationId: "all",
};

type DeputyFiltersModalProps = {
    open: boolean;
    initialFilters: DeputyAdvancedFilters;
    onClose: () => void;
    onApply: (filters: DeputyAdvancedFilters) => void;
};

export function DeputyFiltersModal({
    open,
    initialFilters,
    onClose,
    onApply,
}: DeputyFiltersModalProps) {
    const [draft, setDraft] = useState<DeputyAdvancedFilters>(initialFilters);

    // Reset the draft to whatever filters are currently active whenever the modal opens
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (open) setDraft(initialFilters);
    }, [open, initialFilters]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    const activeCount = Object.values(draft).filter((v) => v !== "all").length;

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deputy-filters-title"
        >
            <button
                type="button"
                aria-label="إغلاق"
                onClick={onClose}
                className="absolute inset-0 bg-slate-dark/50 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-md rounded-card bg-surface-container-lowest border border-outline-variant shadow-level-2">
                <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-outline-variant">
                    <div className="flex items-center gap-2 text-primary">
                        <SlidersHorizontal size={18} />
                        <h2 id="deputy-filters-title" className="text-title-card text-on-surface" style={{ fontSize: 18 }}>
                            فلاتر متقدمة
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <div>
                        <label className="text-body-small font-semibold text-on-surface-variant mb-2 block">
                            الأولوية (Priority)
                        </label>
                        <select
                            value={draft.priority}
                            onChange={(e) => setDraft((f) => ({ ...f, priority: e.target.value }))}
                            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant"
                        >
                            <option value="all">كل الأولويات</option>
                            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-body-small font-semibold text-on-surface-variant mb-2 block">
                            القسم / الإدارة (DepartmentId)
                        </label>
                        <select
                            value={draft.departmentId}
                            onChange={(e) => setDraft((f) => ({ ...f, departmentId: e.target.value }))}
                            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant"
                        >
                            <option value="all">كل الأقسام</option>
                            {DEPARTMENT_OPTIONS.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-body-small font-semibold text-on-surface-variant mb-2 block">
                            الجهة (OrganizationId)
                        </label>
                        <select
                            value={draft.organizationId}
                            onChange={(e) => setDraft((f) => ({ ...f, organizationId: e.target.value }))}
                            className="input-field w-full py-2.5 px-3 text-body-small text-on-surface-variant"
                        >
                            <option value="all">كل الجهات</option>
                            {ORGANIZATION_OPTIONS.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-outline-variant bg-surface-container-low rounded-b-card">
                    <button
                        type="button"
                        onClick={() => setDraft(EMPTY_ADVANCED_FILTERS)}
                        disabled={activeCount === 0}
                        className="text-body-small text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                    >
                        إعادة تعيين
                    </button>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onClose} className="btn-outline px-5 py-2.5 text-body-main">
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onApply(draft);
                                onClose();
                            }}
                            className="btn-primary px-5 py-2.5 text-body-main font-semibold"
                        >
                            تطبيق {activeCount > 0 && `(${activeCount})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}