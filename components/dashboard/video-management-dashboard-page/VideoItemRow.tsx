"use client";

import { GripVertical, Trash2, Pencil, Video } from "lucide-react";

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
};

export function VideoItemRow({ item, onEdit, onRemove }: VideoItemRowProps) {
    return (
        <div className="flex items-center gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-4">
            <button
                type="button"
                aria-label="إعادة الترتيب"
                className="text-on-surface-variant/60 hover:text-on-surface-variant cursor-grab active:cursor-grabbing shrink-0"
            >
                <GripVertical size={18} />
            </button>

            <span className="text-title-card text-primary shrink-0 w-8 text-center" style={{ fontSize: 18 }}>
                {String(item.order).padStart(2, "0")}
            </span>

            <div className="w-20 h-14 rounded-interactive overflow-hidden bg-surface-container-high border border-outline-variant shrink-0 flex items-center justify-center relative">
                {item.videoUrl ? (
                    <video src={item.videoUrl} className="w-full h-full object-cover" />
                ) : (
                    <Video size={18} className="text-on-surface-variant/50" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-body-main font-semibold text-on-surface truncate">
                    {item.title || "بدون عنوان"}
                </p>
                <p className="text-body-small text-on-surface-variant/70 truncate ltr text-right dir-ltr">
                    {item.videoUrl || "لم يتم تحديد رابط الفيديو"}
                </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label="تعديل الفيديو"
                    className="text-on-surface-variant hover:bg-surface-container-high rounded-interactive p-2 transition-colors"
                >
                    <Pencil size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label="حذف الفيديو"
                    className="text-error hover:bg-error-container rounded-interactive p-2 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}