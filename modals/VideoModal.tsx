/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { X, Upload, Video as VideoIcon, Link as LinkIcon } from "lucide-react";
import { Field, InputWithIcon } from "@/components/dashboard/hero-management-dashboard-page/Formfield";
import { VideoItem } from "@/components/dashboard/video-management-dashboard-page/VideoItemRow";

type ModalProps = {
    open: boolean;
    initialItem?: VideoItem;
    onClose: () => void;
    onSave: (item: Omit<VideoItem, "order">) => void;
};

export function VideoModal({ open, initialItem, onClose, onSave }: ModalProps) {
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        if (initialItem) {
            setTitle(initialItem.title);
            setVideoUrl(initialItem.videoUrl || "");
        } else {
            setTitle("");
            setVideoUrl("");
        }
    }, [initialItem, open]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setVideoUrl(previewUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialItem?.id || Date.now().toString(),
            title,
            videoUrl,
        });
        onClose();
    };

    return (
        <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <button type="button" aria-label="إغلاق" onClick={onClose} className="absolute inset-0 bg-slate-dark/50 backdrop-blur-[2px]" />

            <div className="relative w-full max-w-lg rounded-card bg-surface-container-lowest border border-outline-variant shadow-level-2 z-10">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-outline-variant">
                        <div>
                            <h2 className="text-title-card text-on-surface" style={{ fontSize: 20 }}>
                                {initialItem ? "تعديل الفيديو" : "إضافة فيديو جديد"}
                            </h2>
                            <p className="text-body-small text-on-surface-variant mt-1">
                                أدخل عنوان الفيديو وقام برفع ملف الفيديو أو إضافة الرابط.
                            </p>
                        </div>
                        <button type="button" onClick={onClose} aria-label="إغلاق" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-4">
                        <Field label="عنوان الكلمة / الفيديو">
                            <InputWithIcon
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                placeholder="مثال: حلف اليمين داخل البرلمان"
                                required
                            />
                        </Field>

                        <Field label="رابط الفيديو (URL)">
                            <InputWithIcon
                                value={videoUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)}
                                placeholder="https://..."
                                icon={<LinkIcon size={16} />}
                            />
                        </Field>

                        <div className="flex items-center gap-3 my-1">
                            <div className="h-[1px] flex-1 bg-outline-variant" />
                            <span className="text-caption text-on-surface-variant">أو قم برفع ملف مباشرة</span>
                            <div className="h-[1px] flex-1 bg-outline-variant" />
                        </div>

                        <Field label="ملف الفيديو">
                            <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-interactive border-2 border-dashed border-outline-variant hover:border-primary/50 bg-surface-container-low cursor-pointer transition-colors">
                                <div className="p-3 rounded-full bg-surface-container-high text-on-surface-variant">
                                    <Upload size={18} />
                                </div>
                                <span className="text-body-small font-semibold text-primary">اختيار فيديو من الجهاز</span>
                                <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </Field>
                    </div>

                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-container-low rounded-b-card">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-body-small font-semibold text-on-surface-variant hover:bg-surface-container rounded-interactive transition-colors">
                            إلغاء
                        </button>
                        <button type="submit" className="px-5 py-2 text-body-small font-semibold bg-primary text-on-primary rounded-interactive hover:opacity-90 transition-opacity">
                            حفظ الفيديو
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

