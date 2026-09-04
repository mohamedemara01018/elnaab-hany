"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface VideoModalProps {
    isOpen: boolean;
    src: string;
    title?: string;
    onClose: () => void;
}

export default function VideoModal({
    isOpen,
    src,
    title = "Video player preview",
    onClose,
}: VideoModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 cursor-pointer"
        >
            {/* Close Button */}
            <button
                type="button"
                onClick={onClose}
                aria-label="Close video player"
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-surface-container/50 text-on-surface hover:bg-surface-container hover:scale-105 transition-all cursor-pointer"
            >
                <X size={24} />
            </button>

            {/* Video Player Container */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] aspect-video rounded-lg overflow-hidden shadow-2xl cursor-default bg-black flex items-center justify-center"
            >
                <video
                    src={src}
                    aria-label={title}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full max-h-[90vh] object-contain"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}