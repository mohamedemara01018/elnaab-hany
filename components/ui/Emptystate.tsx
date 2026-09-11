"use client";

import React from "react";
import { motion } from "motion/react";
import { FolderOpen, LucideIcon } from "lucide-react";

export interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    /**
     * "compact" — icon + single line, for use inside a table row or a tight card slot
     * "default" — icon circle + title + description + optional action for section cards
     * "large" — expanded container for main section empty states
     */
    size?: "compact" | "default" | "large";
    className?: string;
    iconClassName?: string;
}

export function EmptyState({
    icon: Icon = FolderOpen,
    title,
    description,
    action,
    size = "default",
    className = "",
    iconClassName = "",
}: EmptyStateProps) {
    if (size === "compact") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                role="status"
                className={`flex flex-col items-center justify-center gap-2 p-6 text-on-surface-variant ${className}`}
            >
                <Icon size={22} className={`text-primary/70 ${iconClassName}`} />
                <p className="text-body-md font-medium text-on-surface-variant">{title}</p>
                {description && <p className="text-xs text-on-surface-variant/80">{description}</p>}
            </motion.div>
        );
    }

    const padding = size === "large" ? "py-16 px-8" : "py-12 px-6";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            role="status"
            className={`flex flex-col items-center justify-center text-center gap-3.5 ${padding} rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 ${className}`}
        >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                <Icon size={28} className={iconClassName} />
            </div>
            <div className="max-w-md">
                <h4 className="font-display font-bold text-lg text-on-surface">{title}</h4>
                {description && (
                    <p className="text-body-small text-on-surface-variant mt-1.5 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-2 btn-primary px-6 py-2.5 text-sm font-bold rounded-xl transition-all"
                >
                    {action.label}
                </button>
            )}
        </motion.div>
    );
}

export default EmptyState;