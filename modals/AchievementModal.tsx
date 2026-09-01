/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { AchievementItem } from "@/components/landing-dashboard/achievements-management-dashboard-page/AchievementItemRow";

interface AchievementModalProps {
    open: boolean;
    initialItem?: AchievementItem;
    onClose: () => void;
    onSave: (item: Omit<AchievementItem, "order">) => void;
}

export function AchievementModal({ open, initialItem, onClose, onSave }: AchievementModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialItem) {
            setTitle(initialItem.title);
            setDescription(initialItem.description);
            setImageUrl(initialItem.imageUrl || "");
        } else {
            setTitle("");
            setDescription("");
            setImageUrl("");
        }
    }, [initialItem, open]);

    if (!open) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setImageUrl(tempUrl);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialItem?.id || Date.now().toString(),
            title,
            description,
            imageUrl,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-surface rounded-card border border-outline-variant p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                    <h3 className="text-title-card font-semibold text-on-surface">
                        {initialItem ? "تعديل الإنجاز" : "إضافة إنجاز جديد"}
                    </h3>
                    <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            عنوان الإنجاز
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                            placeholder="مثال: تجهيز مستشفى كفر شكر بالعلاج البيولوجي"
                        />
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            الوصف والتفاصيل
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                            placeholder="تفاصيل ما تم إنجازه..."
                        />
                    </div>

                    {/* Image File Upload Section */}
                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            صورة الإنجاز
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="achievement-image-upload"
                        />

                        {imageUrl ? (
                            <div className="relative w-full h-40 rounded-interactive overflow-hidden border border-outline-variant bg-surface-container-high group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageUrl} alt="معاينة الصورة" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 bg-surface rounded-full text-on-surface hover:bg-surface-container transition-colors"
                                        title="تغيير الصورة"
                                    >
                                        <Upload size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="p-2 bg-error-container rounded-full text-error hover:bg-error/20 transition-colors"
                                        title="حذف الصورة"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="achievement-image-upload"
                                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-outline-variant rounded-interactive bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer p-4 text-center"
                            >
                                <ImageIcon size={32} className="text-on-surface-variant/50 mb-2" />
                                <span className="text-body-small font-medium text-primary">اضغط هنا لرفع صورة</span>
                                <span className="text-xs text-on-surface-variant mt-1">PNG, JPG, WEBP حتى 5 ميجابايت</span>
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-outline-variant rounded-interactive text-body-small font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-on-primary rounded-interactive text-body-small font-medium hover:opacity-90 transition-opacity"
                        >
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}