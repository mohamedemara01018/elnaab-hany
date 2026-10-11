export type ComplaintStatus = "new" | "in_progress" | "done" | "rejected" | "closed" | number | string;

const STATUS_MAP: Record<string, { label: string; className: string }> = {
    // الحالات النصية
    new: { label: "جديدة", className: "bg-secondary-container text-secondary" },
    in_progress: { label: "قيد المتابعة", className: "bg-tertiary-container/60 text-on-tertiary-container" },
    done: { label: "تم الإنجاز", className: "bg-success-green/15 text-success-green" },
    resolved: { label: "تم الإنجاز", className: "bg-success-green/15 text-success-green" },
    rejected: { label: "مرفوضة", className: "bg-error/15 text-error" },
    closed: { label: "مغلقة", className: "bg-surface-container-highest text-on-surface-variant" },

    // الحالات الرقمية (موافقة لـ RequestStatus Enum)
    "1": { label: "جديدة", className: "bg-secondary-container text-secondary" },
    "2": { label: "قيد المتابعة", className: "bg-tertiary-container/60 text-on-tertiary-container" },
    "3": { label: "تم الإنجاز", className: "bg-success-green/15 text-success-green" },
    "4": { label: "مرفوضة", className: "bg-error/15 text-error" },
    "5": { label: "مغلقة", className: "bg-surface-container-highest text-on-surface-variant" },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
    // توحيد القيمة إلى نص بحرف صغير لتجنب اختلاف الأحرف أو الأرقام
    const normalizedKey = String(status ?? "").toLowerCase().trim();

    const { label, className } = STATUS_MAP[normalizedKey] || {
        label: "غير معروف",
        className: "bg-surface-container text-on-surface-variant"
    };

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-label-caption font-semibold ${className}`}>
            {label}
        </span>
    );
}