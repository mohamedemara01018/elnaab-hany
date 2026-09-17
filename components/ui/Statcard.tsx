'use client";'
import type { ReactNode } from "react";

type StatCardProps = {
    label: string;
    value: number | string;
    icon: ReactNode;
    tone?: "success" | "warning" | "info" | "neutral";
};

const TONE_STYLES: Record<NonNullable<StatCardProps["tone"]>, string> = {
    success: "bg-success-green/15 text-success-green",
    warning: "bg-tertiary-container/60 text-on-tertiary-container",
    info: "bg-secondary-container text-secondary",
    neutral: "bg-surface-container-high text-on-surface-variant",
};

export default function StatCard({ label, value, icon, tone = "neutral" }: StatCardProps) {
    return (
        <div className="card flex items-center justify-between !p-5">
            <div>
                <p className="text-body-small text-on-surface-variant mb-2">{label}</p>
                <p className="text-headline-section text-on-surface" style={{ fontSize: 30 }}>
                    {value}
                </p>
            </div>
            <span
                className={[
                    "w-11 h-11 rounded-interactive flex items-center justify-center shrink-0",
                    TONE_STYLES[tone],
                ].join(" ")}
            >
                {icon}
            </span>
        </div>
    );
}