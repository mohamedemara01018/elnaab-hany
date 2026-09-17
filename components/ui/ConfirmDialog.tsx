"use client";

import React, { useEffect, type ReactNode } from "react";
import { AlertTriangle, HelpCircle, Loader2, X } from "lucide-react";

export type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "default";
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "تأكيد",
    cancelLabel = "إلغاء",
    variant = "default",
    loading = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    const isDanger = variant === "danger";

    // Handle Escape key navigation
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, loading, onClose]);

    if (!open) return null;

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={description ? "confirm-dialog-description" : undefined}
        >
            {/* Backdrop */}
            <div
                aria-hidden="true"
                onClick={() => !loading && onClose()}
                className="fixed inset-0 bg-slate-dark/50 backdrop-blur-[2px] transition-opacity"
            />

            {/* Dialog Container */}
            <div className="relative w-full max-w-sm rounded-card bg-surface-container-lowest border border-outline-variant shadow-level-2 z-10 my-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-2">
                    <div className="flex items-start gap-3">
                        <span
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDanger
                                    ? "bg-error-container text-error"
                                    : "bg-secondary-container text-secondary"
                                }`}
                        >
                            {isDanger ? <AlertTriangle size={17} /> : <HelpCircle size={17} />}
                        </span>
                        <h2
                            id="confirm-dialog-title"
                            className="text-title-card text-on-surface pt-1 text-lg font-bold"
                        >
                            {title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="إغلاق"
                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body / Description */}
                {description && (
                    <div id="confirm-dialog-description" className="px-6 pb-5 ps-[3.75rem]">
                        <p className="text-body-main text-on-surface-variant leading-relaxed">
                            {description}
                        </p>
                    </div>
                )}

                {/* Action Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-container-low rounded-b-card">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="btn-outline px-5 py-2.5 text-body-main disabled:opacity-50 cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex items-center gap-2 px-5 py-2.5 text-body-main font-semibold rounded-interactive transition-colors disabled:opacity-60 cursor-pointer ${isDanger
                                ? "bg-error text-on-error hover:opacity-90"
                                : "btn-primary"
                            }`}
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        <span>{loading ? "جارِ التنفيذ..." : confirmLabel}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}