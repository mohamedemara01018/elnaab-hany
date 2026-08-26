"use client";

import { Save } from "lucide-react";

type SaveBarProps = {
    helperText: string;
    onSave?: () => void;
    onDiscard?: () => void;
    saving?: boolean;
};

export function SaveBar({ helperText, onSave, onDiscard, saving }: SaveBarProps) {
    return (
        <div className="sticky bottom-0 border-t border-outline-variant bg-surface/95 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-6 md:px-10 py-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 px-5 py-2.5 text-body-main font-semibold disabled:opacity-60"
                    >
                        <span>{saving ? "جارِ الحفظ..." : "حفظ التحديثات"}</span>
                        <Save size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={onDiscard}
                        className="btn-outline px-5 py-2.5 text-body-main"
                    >
                        تجاهل التغييرات
                    </button>
                </div>
                <p className="hidden md:block text-body-small text-on-surface-variant">{helperText}</p>
            </div>
        </div>
    );
}