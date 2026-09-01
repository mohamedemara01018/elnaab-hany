export type ComplaintStatus = "new" | "in_progress" | "done";

const STATUS_MAP: Record<ComplaintStatus, { label: string; className: string }> = {
    new: { label: "جديدة", className: "bg-secondary-container text-secondary" },
    in_progress: { label: "قيد المتابعة", className: "bg-tertiary-container/60 text-on-tertiary-container" },
    done: { label: "تم الإنجاز", className: "bg-success-green/15 text-success-green" },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
    const { label, className } = STATUS_MAP[status];
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-label-caption font-semibold ${className}`}>
            {label}
        </span>
    );
}