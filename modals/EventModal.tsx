/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { X, Upload, Calendar, MapPin, Play, Image as ImageIcon } from "lucide-react";
import { EventItem } from "@/components/landing-dashboard/event-management-dashboard-page/EventsItemRow";

interface EventModalProps {
    open: boolean;
    initialItem?: EventItem;
    onClose: () => void;
    onSave: (item: Omit<EventItem, "order">) => void;
}

export function EventModal({ open, initialItem, onClose, onSave }: EventModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState<"image" | "video">("image");
    const [mediaUrl, setMediaUrl] = useState("");

    useEffect(() => {
        if (initialItem) {
            setTitle(initialItem.title);
            setDescription(initialItem.description);
            setLocation(initialItem.location);
            setDate(initialItem.date);
            setType(initialItem.type);
            setMediaUrl(initialItem.mediaUrl);
        } else {
            setTitle("");
            setDescription("");
            setLocation("");
            setDate("");
            setType("image");
            setMediaUrl("");
        }
    }, [initialItem, open]);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialItem?.id || Date.now().toString(),
            title,
            description,
            location,
            date,
            type,
            mediaUrl,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-surface rounded-card border border-outline-variant p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                    <h3 className="text-title-card font-semibold text-on-surface">
                        {initialItem ? "تعديل الفعالية" : "إضافة فعالية جديدة"}
                    </h3>
                    <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">العنوان</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                            placeholder="مثال: فعالية مجتمعية"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-body-small font-medium text-on-surface-variant mb-1">المكان</label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                placeholder="مثال: كفر شكر"
                            />
                        </div>
                        <div>
                            <label className="block text-body-small font-medium text-on-surface-variant mb-1">التاريخ</label>
                            <input
                                type="text"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                                placeholder="مثال: 22 يونيو"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">الوصف</label>
                        <textarea
                            rows={3}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-interactive bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                            placeholder="تفاصيل الزيارة أو الفعالية..."
                        />
                    </div>

                    <div>
                        <label className="block text-body-small font-medium text-on-surface-variant mb-1">نوع الوسائط</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer text-body-small">
                                <input
                                    type="radio"
                                    name="mediaType"
                                    value="image"
                                    checked={type === "image"}
                                    onChange={() => setType("image")}
                                    className="accent-primary"
                                />
                                <ImageIcon size={16} /> صورة
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-body-small">
                                <input
                                    type="radio"
                                    name="mediaType"
                                    value="video"
                                    checked={type === "video"}
                                    onChange={() => setType("video")}
                                    className="accent-primary"
                                />
                                <Play size={16} /> فيديو
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-outline-variant rounded-interactive text-body-small font-medium text-on-surface-variant hover:bg-surface-container"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-on-primary rounded-interactive text-body-small font-medium hover:opacity-90"
                        >
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}