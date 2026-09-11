/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { X, Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { ActivityItem } from "@/components/landing-dashboard/activities-management-dashboard-page/Activityitemrow";
import { Field, InputWithIcon, TextareaField } from "@/components/landing-dashboard/hero-management-dashboard-page/Formfield";

type ModalProps = {
    open: boolean;
    loading?: boolean;
    initialItem?: ActivityItem;
    onClose: () => void;
    onSave: (item: Omit<ActivityItem, "order">, imageFile?: File) => void;
};

export function ActivityModal({ open, loading = false, initialItem, onClose, onSave }: ModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);

    // تحديث قيم المدخلات عند فتح الـ Modal أو تغيير العناصر
    useEffect(() => {
        if (initialItem) {
            setTitle(initialItem.title);
            setDescription(initialItem.description);
            setImageUrl(initialItem.imageUrl || "");
            setImageFile(undefined);
        } else {
            setTitle("");
            setDescription("");
            setImageUrl("");
            setImageFile(undefined);
        }
    }, [initialItem, open]);

    // الإغلاق عند الضغط على زر Escape
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose, loading]);

    if (!open) return null;

    // معالجة اختيار ملف صورة وتوليد معاينة مؤقتة
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImageUrl(previewUrl);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        setImageFile(undefined);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        onSave(
            {
                id: initialItem?.id || "",
                title,
                description,
                imageUrl,
            },
            imageFile
        );
    };

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <button
                type="button"
                aria-label="إغلاق"
                disabled={loading}
                onClick={onClose}
                className="absolute inset-0 bg-slate-dark/50 backdrop-blur-[2px] disabled:cursor-not-allowed"
            />

            {/* Dialog */}
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-card bg-surface-container-lowest border border-outline-variant shadow-level-2 z-10">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-outline-variant">
                        <div>
                            <h2 id="modal-title" className="text-title-card text-on-surface" style={{ fontSize: 20 }}>
                                {initialItem ? "تعديل مجال العمل" : "إضافة مجال عمل جديد"}
                            </h2>
                            <p className="text-body-small text-on-surface-variant mt-1">
                                أدخل تفاصيل المجال التي ستظهر للمواطنين في الصفحة الرئيسية.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="إغلاق"
                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Content / Body */}
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <Field label="عنوان المجال">
                            <InputWithIcon
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                placeholder="مثال: الخدمات الصحية"
                                required
                                disabled={loading}
                            />
                        </Field>

                        <Field label="وصف قصير">
                            <TextareaField
                                rows={3}
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                placeholder="اكتب وصفاً موجزاً للمجال..."
                                required
                                disabled={loading}
                            />
                        </Field>

                        {/* قسم رفع وحذف الصورة */}
                        <Field label="صورة المجال">
                            {imageUrl ? (
                                <div className="relative rounded-interactive overflow-hidden border border-outline-variant h-40 bg-surface-container-low group">
                                    <img
                                        src={imageUrl}
                                        alt="معاينة الصورة"
                                        className="w-full h-full object-cover"
                                    />
                                    {!loading && (
                                        <div className="absolute inset-0 bg-slate-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <label className="cursor-pointer p-2 rounded-full bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors">
                                                <Upload size={16} />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    disabled={loading}
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="p-2 rounded-full bg-error/90 text-on-error hover:bg-error transition-colors"
                                                aria-label="حذف الصورة"
                                                disabled={loading}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center gap-2 p-6 rounded-interactive border-2 border-dashed border-outline-variant bg-surface-container-low transition-colors group ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 cursor-pointer"}`}>
                                    <div className="p-3 rounded-full bg-surface-container-high group-hover:bg-primary/10 text-on-surface-variant group-hover:text-primary transition-colors">
                                        <ImageIcon size={20} />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-body-small font-semibold text-primary">انقر لرفع صورة</span>
                                        <p className="text-caption text-on-surface-variant mt-0.5">PNG, JPG أو WEBP حتى 5MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                    />
                                </label>
                            )}
                        </Field>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-container-low rounded-b-card">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-body-small font-semibold text-on-surface-variant hover:bg-surface-container rounded-interactive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 text-body-small font-semibold bg-primary text-on-primary rounded-interactive hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            <span>{loading ? "جاري الحفظ..." : "حفظ"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}