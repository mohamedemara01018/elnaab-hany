/* eslint-disable @next/next/no-img-element */
"use client";

import { Edit2, Trash2, Phone, User, Mail, Building2, Briefcase } from "lucide-react";
import { EmployeeItem } from "@/types/employee.types";

type TeamItemRowProps = {
    item: EmployeeItem;
    order: number;
    onEdit: (item: EmployeeItem) => void;
    onRemove: (id: string) => void;
};

export function TeamItemRow({ item, order, onEdit, onRemove }: TeamItemRowProps) {
    const displayName = item.fullName || "بدون اسم";
    const avatarSrc = item.imageUrl;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant bg-surface hover:border-primary/50 transition-colors">
            <div className="flex items-start sm:items-center gap-4 min-w-0">
                {/* Order Badge */}
                <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0 font-bold text-primary text-body-small">
                    {String(order).padStart(2, "0")}
                </div>

                {/* Member Avatar */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                    {avatarSrc ? (
                        <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center text-on-surface-variant/40">
                            <User size={24} />
                        </div>
                    )}
                </div>

                {/* Member Details */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-body-main font-semibold text-on-surface truncate">
                            {displayName}
                        </h3>
                        {item.departmentName && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-primary/10 text-primary rounded-full shrink-0">
                                <Briefcase size={10} />
                                {item.departmentName}
                            </span>
                        )}
                    </div>

                    <p className="text-body-small text-on-surface-variant line-clamp-1">
                        {item.about || "لا يوجد اختصاص / نبذة"}
                    </p>

                    {/* Metadata Attributes */}
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-on-surface-variant">
                        {item.email && (
                            <span className="flex items-center gap-1 font-mono dir-ltr">
                                <Mail size={12} className="text-primary" />
                                {item.email}
                            </span>
                        )}

                        {item.phone && (
                            <span className="flex items-center gap-1 font-mono dir-ltr">
                                <Phone size={12} className="text-primary" />
                                <span>{item.phone}</span>
                            </span>
                        )}

                        {item.organizations && item.organizations.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                                <Building2 size={12} className="text-primary shrink-0" />
                                {item.organizations.map((org, index) => (
                                    <span
                                        key={index}
                                        className="bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded text-[11px]"
                                    >
                                        {org}
                                    </span>
                                ))}
                            </div>
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