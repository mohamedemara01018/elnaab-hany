export const formatDateTime = (date: string | Date) => {
    const formattedDate = new Date(date);

    return {
        date: formattedDate.toLocaleDateString("en-GB"),
        time: formattedDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};


export function getInitials(firstName: string, lastName: string) {
    const first = firstName?.charAt(0) ?? "";
    const last = lastName?.charAt(0) ?? "";
    return (first + last).toUpperCase() || "?";
}

export function getMediaUrl(url?: string | null): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${cleanUrl}`;
}