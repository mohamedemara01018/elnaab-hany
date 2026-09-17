import {
    GetHeroInfoResponse,
    UpdateHeroInfoPayload,
    UpdateHeroInfoResponse
} from "@/types/hero.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};


export const heroService = {
    getHeroInfo: async (): Promise<GetHeroInfoResponse> => {
        const response = await fetch(`${BASE_URL}/api/Deputy/api/HeroInfo`, {
            method: "GET",
            headers: {
                "accept": "*/*",
            },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
        }

        return data as GetHeroInfoResponse;
    },

    updateHeroInfo: async (payload: UpdateHeroInfoPayload): Promise<UpdateHeroInfoResponse> => {
        const formData = new FormData();

        // إلحاق القيمة فقط إذا كانت موجودة وغير فارغة لتجنب أخطاء Validation بالـ Backend
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (key === "Media" && value instanceof File) {
                    formData.append("Media", value);
                } else if (typeof value === "string") {
                    formData.append(key, value);
                }
            }
        });

        const response = await fetch(`${BASE_URL}/api/Deputy/api/HeroInfo`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            // استخراج رسالة الخطأ من السيرفر وإلقاؤها
            const serverMessage = data?.message || data?.title || data?.error || `HTTP error! status: ${response.status}`;
            throw new Error(serverMessage);
        }

        return data as UpdateHeroInfoResponse;
    },
};