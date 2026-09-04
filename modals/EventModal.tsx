"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2, Loader2, Play, Image as ImageIcon } from "lucide-react";
import { EventItem } from "@/components/landing-dashboard/event-management-dashboard-page/EventsItemRow";

interface EventModalProps {
    open: boolean;
    initialItem?: EventItem;
    onClose: () => void;
    onSave: (data: {
        title: string;
        description: string;
        location: string;
        date?: string;
        media?: File;
    }) => Promise<void>;
}

export function EventModal({ open, initialItem, onClose, onSave }: EventModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            if (initialItem) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTitle(initialItem.title || "");
                setDescription(initialItem.description || "");
                setLocation(initialItem.location || "");
                // إدخال التاريخ بصيغة YYYY-MM-DD
                setDate(initialItem.date ? initialItem.date.split("T")[0] : "");
                setPreviewUrl(initialItem.mediaUrl || "");
            } else {
                setTitle("");
                setDescription("");
                setLocation("");
                setDate(new Date().toISOString().split("T")[0]);
                setPreviewUrl("");
            }
            setSelectedFile(undefined);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [initialItem, open]);

    if (!open) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const tempUrl = URL.createObjectURL(file);
            setPreviewUrl(tempUrl);
        }
    };

    const handleRemoveMedia = () => {
        setPreviewUrl("");
        setSelectedFile(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSave({
                title,
                description,
                location,
                date: date ? new Date(date).toISOString() : undefined,
                media: selectedFile,
            });
            onClose();
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-surface rounded-card border border-outline-variant p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                    <h3 className="text-title-card font-semibold text-on-surface">
                        {initialItem ? "تعديل الفعالية" : "إضافة فعالية جديدة"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="text-on-surface-variant hover:text-on-surface disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">العنوان</label>
                        <input
                            type="text"
                            required
                            disabled={submitting}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary disabled:opacity-60"
                            placeholder="مثال: فعالية مجتمعية"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-body-small font-medium text-on-surface-variant mb-1">المكان</label>
                            <input
                                type="text"
                                required
                                disabled={submitting}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary disabled:opacity-60"
                                placeholder="مثال: كفر شكر"
                            />
                        </div>
                        <div>
                            <label className="block text-body-small font-medium text-on-surface-variant mb-1">التاريخ</label>
                            <input
                                type="date"
                                required
                                disabled={submitting}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary disabled:opacity-60"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">الوصف</label>
                        <textarea
                            rows={3}
                            required
                            disabled={submitting}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary disabled:opacity-60"
                            placeholder="تفاصيل الزيارة أو الفعالية..."
                        />
                    </div>

                    {/* رفع الوسائط */}
                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            صورة أو فيديو الفعالية
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            disabled={submitting}
                            className="hidden"
                            id="event-media-upload"
                        />

                        {previewUrl ? (
                            <div className="relative w-full h-40 rounded-interactive overflow-hidden border border-outline-variant bg-surface-container-high group">
                                {selectedFile?.type.startsWith("video") || previewUrl.includes(".mp4") ? (
                                    <video src={previewUrl} className="w-full h-full object-cover" controls />
                                ) : (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={previewUrl} alt="معاينة الملف" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        disabled={submitting}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 bg-surface rounded-full text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                                        title="تغيير الملف"
                                    >
                                        <Upload size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={submitting}
                                        onClick={handleRemoveMedia}
                                        className="p-2 bg-error-container rounded-full text-error hover:bg-error/20 transition-colors disabled:opacity-50"
                                        title="حذف الملف"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="event-media-upload"
                                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-outline-variant rounded-interactive bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer p-4 text-center"
                            >
                                <div className="flex gap-2 text-on-surface-variant/50 mb-2">
                                    <ImageIcon size={28} />
                                    <Play size={28} />
                                </div>
                                <span className="text-body-small font-medium text-primary">اضغط هنا لرفع صورة أو فيديو</span>
                                <span className="text-xs text-on-surface-variant mt-1">PNG, JPG, MP4 حتى 10 ميجابايت</span>
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 border border-outline-variant rounded-interactive text-body-small font-medium text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-interactive text-body-small font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            <span>حفظ</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}