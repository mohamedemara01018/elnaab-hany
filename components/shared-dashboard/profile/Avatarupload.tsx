/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, ShieldCheck } from "lucide-react";

type AvatarUploadProps = {
    name: string;
    title: string;
    email: string;
    currentImageUrl?: string | null;
    onImageChange?: (file: File | null) => void;
};

export function AvatarUpload({
    name,
    title,
    email,
    currentImageUrl,
    onImageChange,
}: AvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keep preview in sync when external server image URL loads
    useEffect(() => {
        setPreview(currentImageUrl || null);
    }, [currentImageUrl]);

    const handleFileSelect = (file: File | null) => {
        if (file) {
            setPreview(URL.createObjectURL(file));
            onImageChange?.(file);
        }
    };

    const handleReset = () => {
        setPreview(currentImageUrl || null);
        if (inputRef.current) inputRef.current.value = "";
        onImageChange?.(null);
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 bg-surface-container-high flex items-center justify-center">
                    {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-title-card text-on-surface-variant">
                            {name ? name.slice(0, 1) : "U"}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    aria-label="تغيير الصورة"
                    className="absolute -bottom-1 -end-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center border-2 border-surface-container-lowest"
                >
                    <Camera size={13} />
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileSelect(file);
                    }}
                />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-body-main font-bold text-on-surface">{name || "الموظف"}</p>
                <p className="text-body-small text-on-surface-variant mt-0.5">{title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-label-caption text-on-surface-variant" dir="ltr">
                        {email}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-green/15 text-success-green px-2.5 py-1 text-label-caption font-semibold">
                        <ShieldCheck size={11} />
                        موظف معتمد
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button
                    type="button"
                    onClick={handleReset}
                    className="btn-outline px-4 py-2 text-body-small"
                >
                    استعادة الافتراضية
                </button>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="btn-primary px-4 py-2 text-body-small font-semibold"
                >
                    رفع صورة جديدة
                </button>
            </div>
        </div>
    );
}