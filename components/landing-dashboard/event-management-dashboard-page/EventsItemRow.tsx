/* eslint-disable @next/next/no-img-element */
"use client";

import { Edit2, Trash2, Calendar, MapPin, Play, Image as ImageIcon, Maximize2 } from "lucide-react";

export interface EventItem {
    id: string;
    order: number;
    title: string;
    description: string;
    location: string;
    date: string;
    type: "image" | "video";
    mediaUrl: string;
}

interface EventItemRowProps {
    item: EventItem;
    onEdit: (item: EventItem) => void;
    onRemove: (id: string) => void;
    onPreviewImage?: (src: string, title: string) => void;
}

export function EventItemRow({ item, onEdit, onRemove, onPreviewImage }: EventItemRowProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant bg-surface hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4 min-w-0">
                {/* Media Preview Thumbnail */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                    {item.mediaUrl ? (
                        item.type === "image" ? (
                            <button
                                type="button"
                                onClick={() => onPreviewImage?.(item.mediaUrl, item.title)}
                                className="relative w-full h-full group cursor-pointer"
                                aria-label="تكبير الصورة"
                            >
                                <img
                                    src={item.mediaUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                    <Maximize2 size={18} />
                                </div>
                            </button>
                        ) : (
                            <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                        )
                    ) : (
                        <div className="flex items-center justify-center text-on-surface-variant/40">
                            {item.type === "video" ? <Play size={24} /> : <ImageIcon size={24} />}
                        </div>
                    )}
                    <span className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-md text-xs pointer-events-none">
                        {item.type === "video" ? <Play size={10} /> : <ImageIcon size={10} />}
                    </span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 text-body-small text-on-surface-variant">
                        <span className="flex items-center gap-1 truncate"><MapPin size={12} />{item.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 shrink-0"><Calendar size={12} />{item.date}</span>
                    </div>
                    <h3 className="text-body-main font-semibold text-on-surface truncate">{item.title}</h3>
                    <p className="text-body-small text-on-surface-variant line-clamp-1">{item.description}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label="تعديل الفعالية"
                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-interactive transition-colors"
                    title="تعديل"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label="حذف الفعالية"
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-interactive transition-colors"
                    title="حذف"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}