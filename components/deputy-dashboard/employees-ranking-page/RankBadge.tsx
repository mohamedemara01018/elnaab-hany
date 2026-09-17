import type { ReactNode } from "react";
import { Crown, Medal, Award } from "lucide-react";

const RANK_STYLES: Record<number, { label: string; className: string; icon: ReactNode }> = {
    1: {
        label: "المركز الأوّل",
        className: "bg-success-green/15 text-success-green",
        icon: <Crown size={13} />,
    },
    2: {
        label: "المركز الثاني",
        className: "bg-tertiary-container/50 text-on-tertiary-container",
        icon: <Medal size={13} />,
    },
    3: {
        label: "المركز الثالث",
        className: "bg-error-container/50 text-error",
        icon: <Award size={13} />,
    },
};

export function RankBadge({ rank }: { rank: number }) {
    const preset = RANK_STYLES[rank];

    if (preset) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-label-caption font-bold ${preset.className}`}
            >
                {preset.icon}
                <span>{preset.label}</span>
            </span>
        );
    }

    return (
        <span className="inline-flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant px-3 py-1.5 text-label-caption font-bold min-w-[2.5rem]">
            #{rank}
        </span>
    );
}