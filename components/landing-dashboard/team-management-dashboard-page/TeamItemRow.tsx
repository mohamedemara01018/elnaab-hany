/* eslint-disable @next/next/no-img-element */
"use client";

import { Edit2, Trash2, Phone, Clock, User } from "lucide-react";

export type TeamItem = {
    id: string;
    order: number;
    name: string;
    role: string;
    phone: string;
    imageUrl?: string;
    availableHours?: string;
};

type TeamItemRowProps = {
    item: TeamItem;
    onEdit: (item: TeamItem) => void;
    onRemove: (id: string) => void;
};

export function TeamItemRow({ item, onEdit, onRemove }: TeamItemRowProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant bg-surface hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4 min-w-0">
                {/* Order Badge */}
                <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0 font-bold text-primary text-body-small">
                    {String(item.order).padStart(2, "0")}
                </div>

                {/* Member Avatar */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center text-on-surface-variant/40">
                            <User size={24} />
                        </div>
                    )}
                </div>

                {/* Member Details */}
                <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-body-main font-semibold text-on-surface truncate">
                        {item.name || "بدون اسم"}
                    </h3>
                    <p className="text-body-small text-on-surface-variant line-clamp-1">
                        {item.role || "لا يوجد اختصاص"}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-on-surface-variant">
                        {item.phone && (
                            <span className="flex items-center gap-1 font-mono dir-ltr">
                                <Phone size={12} className="text-primary" />
                                {item.phone}
                            </span>
                        )}
                        {item.availableHours && (
                            <span className="flex items-center gap-1">
                                <Clock size={12} className="text-primary" />
                                {item.availableHours}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label="تعديل العضو"
                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-interactive transition-colors"
                    title="تعديل"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label="حذف العضو"
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-interactive transition-colors"
                    title="حذف"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}