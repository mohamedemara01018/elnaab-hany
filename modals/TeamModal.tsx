/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, User, Trash2 } from "lucide-react";
import { TeamItem } from "@/components/landing-dashboard/team-management-dashboard-page/TeamItemRow";

interface TeamModalProps {
    open: boolean;
    initialItem?: TeamItem;
    onClose: () => void;
    onSave: (item: Omit<TeamItem, "order">) => void;
}

export function TeamModal({ open, initialItem, onClose, onSave }: TeamModalProps) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [availableHours, setAvailableHours] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialItem) {
            setName(initialItem.name);
            setRole(initialItem.role);
            setPhone(initialItem.phone);
            setImageUrl(initialItem.imageUrl || "");
            setAvailableHours(initialItem.availableHours || "");
        } else {
            setName("");
            setRole("");
            setPhone("");
            setImageUrl("");
            setAvailableHours("");
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
            name,
            role,
            phone,
            imageUrl: imageUrl || undefined,
            availableHours: availableHours.trim() || undefined,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-surface rounded-card border border-outline-variant p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                    <h3 className="text-title-card font-semibold text-on-surface">
                        {initialItem ? "تعديل بيانات العضو" : "إضافة عضو جديد للفريق"}
                    </h3>
                    <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload Area */}
                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-2">
                            صورة العضو (اختياري)
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="team-member-image-upload"
                        />

                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high flex items-center justify-center shrink-0">
                                {imageUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={imageUrl} alt="معاينة العضو" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-on-surface-variant/40" />
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="btn-outline flex items-center gap-2 px-3 py-1.5 text-xs font-medium"
                                >
                                    <Upload size={14} />
                                    <span>{imageUrl ? "تغيير الصورة" : "رفع صورة"}</span>
                                </button>
                                {imageUrl && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="p-2 text-error hover:bg-error/10 rounded-interactive transition-colors"
                                        title="إزالة الصورة"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            الاسم والمسمى الوظيفي
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                            placeholder="مثال: الأستاذ رفعت"
                        />
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            المسؤولية الاختصاصية
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                            placeholder="مثال: مسؤول متابعة طلبات الوزارات والمحافظة والإدارات التابعة لها."
                        />
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            رقم الهاتف
                        </label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary dir-ltr text-right"
                            placeholder="01036200117"
                        />
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">
                            مواعيد التواصل (اختياري)
                        </label>
                        <input
                            type="text"
                            value={availableHours}
                            onChange={(e) => setAvailableHours(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                            placeholder="مثال: يومياً من 1:00 ظهراً حتى 10:00 مساءً"
                        />
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