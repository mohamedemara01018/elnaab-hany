export function ContributionBar({ percentage }: { percentage: number }) {
    const clamped = Math.max(0, Math.min(100, percentage));
    const isTop = clamped >= 100;

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${isTop ? "bg-slate-dark" : "bg-outline"}`}
                    style={{ width: `${clamped}%` }}
                />
            </div>
            <span className="text-body-small font-semibold text-on-surface w-10 text-end shrink-0">
                {Math.round(clamped)}%
            </span>
        </div>
    );
}