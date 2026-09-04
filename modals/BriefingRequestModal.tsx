/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { BriefingRequestItem } from "@/components/landing-dashboard/briefing-requests-dashboard-page/BriefingRequestItemRow";
import { Field, InputWithIcon, TextareaField } from "@/components/landing-dashboard/hero-management-dashboard-page/Formfield";

type ModalProps = {
    open: boolean;
    initialItem?: BriefingRequestItem;
    onClose: () => void;
    onSave: (
        itemData: { title: string; description: string; media?: File | Blob },
        id?: string
    ) => Promise<void> | void;
};

export function BriefingRequestModal({ open, initialItem, onClose, onSave }: ModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialItem) {
            setTitle(initialItem.title);
            setDescription(initialItem.description);
            setPreviewUrl(initialItem.imageUrl || "");
            setMediaFile(null);
        } else {
            setTitle("");
            setDescription("");
            setPreviewUrl("");
            setMediaFile(null);
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
            setMediaFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await onSave(
                {
                    title,
                    description,
                    media: mediaFile || undefined,
                },
                initialItem?.id
            );
            onClose();
        } catch {
            // Error handling is handled in page via toastify
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <button type="button" aria-label="إغلاق" onClick={onClose} className="absolute inset-0 bg-slate-dark/50 backdrop-blur-[2px]" />

            <div className="relative w-full max-w-lg rounded-card bg-surface-container-lowest border border-outline-variant shadow-level-2 z-10">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-outline-variant">
                        <div>
                            <h2 className="text-title-card text-on-surface" style={{ fontSize: 20 }}>
                                {initialItem ? "تعديل طلب الإحاطة" : "إضافة طلب إحاطة جديد"}
                            </h2>
                            <p className="text-body-small text-on-surface-variant mt-1">
                                أدخل تفاصيل وصورة طلب الإحاطة ليتم عرضها في الموقع.
                            </p>
                        </div>
                        <button type="button" onClick={onClose} aria-label="إغلاق" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-4">
                        <Field label="عنوان طلب الإحاطة">
                            <InputWithIcon
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                placeholder="مثال: خطة توصيل الغاز الطبيعي للمنازل"
                                required
                            />
                        </Field>

                        <Field label="الوصف التوضيحي">
                            <TextareaField
                                rows={3}
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                placeholder="أدخل تفاصيل الطلب..."
                                required
                            />
                        </Field>

                        <Field label="صورة المعاينة">
                            <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-interactive border-2 border-dashed border-outline-variant hover:border-primary/50 bg-surface-container-low cursor-pointer transition-colors relative overflow-hidden">
                                {previewUrl ? (
                                    <div className="flex flex-col items-center gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="المعاينة" className="max-h-32 rounded-md object-cover mb-2" />
                                        <span className="text-body-small font-semibold text-primary">تغيير الصورة</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-3 rounded-full bg-surface-container-high text-on-surface-variant">
                                            <Upload size={18} />
                                        </div>
                                        <span className="text-body-small font-semibold text-primary">اختيار صورة من الجهاز</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </Field>
                    </div>

                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-container-low rounded-b-card">
                        <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 text-body-small font-semibold text-on-surface-variant hover:bg-surface-container rounded-interactive transition-colors disabled:opacity-50">
                            إلغاء
                        </button>
                        <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 text-body-small font-semibold bg-primary text-on-primary rounded-interactive hover:opacity-90 transition-opacity disabled:opacity-50">
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>حفظ الطلب</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}