"use client";

import { Edit2, Trash2, Video, Play } from "lucide-react";

export type VideoItem = {
    id: string;
    order: number;
    title: string;
    videoUrl: string;
};

type VideoItemRowProps = {
    item: VideoItem;
    onEdit: (item: VideoItem) => void;
    onRemove: (id: string) => void;
    onPreviewVideo?: (src: string, title: string) => void;
};

export function VideoItemRow({ item, onEdit, onRemove, onPreviewVideo }: VideoItemRowProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant bg-surface hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4 min-w-0">
                {/* Media Preview Thumbnail */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                    {item.videoUrl ? (
                        <button
                            type="button"
                            onClick={() => onPreviewVideo?.(item.videoUrl, item.title)}
                            className="relative w-full h-full group cursor-pointer"
                            aria-label="تشغيل الفيديو"
                        >
                            <video src={item.videoUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                <Play size={20} className="fill-white" />
                            </div>
                        </button>
                    ) : (
                        <div className="flex items-center justify-center text-on-surface-variant/40">
                            <Video size={24} />
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 text-body-small text-primary font-medium">
                        <span>الترتيب: {String(item.order).padStart(2, "0")}</span>
                    </div>
                    <h3 className="text-body-main font-semibold text-on-surface truncate">
                        {item.title || "بدون عنوان"}
                    </h3>
                    <p className="text-body-small text-on-surface-variant line-clamp-1 dir-ltr text-right">
                        {item.videoUrl || "لم يتم تحديد رابط الفيديو"}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label="تعديل الفيديو"
                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-interactive transition-colors"
                    title="تعديل"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label="حذف الفيديو"
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-interactive transition-colors"
                    title="حذف"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}