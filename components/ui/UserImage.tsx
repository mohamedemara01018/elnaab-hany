"use client";

import React, { useState } from "react";
import { getInitials } from "@/utils/functions.utils";

export interface UserImageProps {
    fullName?: string | null;
    avatarUrl?: string | null;
    className?: string;
    onClick?: () => void;
}

export function UserImage({
    fullName = "",
    avatarUrl,
    className = "w-10 h-10",
    onClick,
}: UserImageProps) {
    const [hasError, setHasError] = useState(false);

    const name = fullName?.trim() || "User";

    // Split full name into first and last for getInitials fallback
    const nameParts = name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const initials = getInitials
        ? getInitials(firstName, lastName)
        : name.charAt(0).toUpperCase();

    const showImage = Boolean(avatarUrl) && !hasError;

    return (
        <div
            onClick={onClick}
            aria-label={name}
            className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-primary/30 transition-all select-none ${className}`}
        >
            {showImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={avatarUrl!}
                    alt={name}
                    onError={() => setHasError(true)}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="w-full h-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold uppercase tracking-wider">
                    {initials}
                </span>
            )}
        </div>
    );
}

export default UserImage;