import {
    GetAchievementsResponse,
    GetAchievementByIdResponse,
    CreateAchievementPayload,
    CreateAchievementResponse,
    UpdateAchievementPayload,
    UpdateAchievementResponse,
    DeleteAchievementResponse
} from "@/types/achievement.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const achievementService = {
    getAll: async (): Promise<GetAchievementsResponse> => {
        const response = await fetch(`${BASE_URL}/api/achievements`, {
            method: "GET",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as GetAchievementsResponse;
    },

    getById: async (achievementId: number): Promise<GetAchievementByIdResponse> => {
        const response = await fetch(`${BASE_URL}/api/achievements/${achievementId}`, {
            method: "GET",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as GetAchievementByIdResponse;
    },

    create: async (payload: CreateAchievementPayload): Promise<CreateAchievementResponse> => {
        const formData = new FormData();
        formData.append("Title", payload.Title);
        formData.append("Description", payload.Description);
        if (payload.Media) {
            formData.append("Media", payload.Media);
        }

        const response = await fetch(`${BASE_URL}/api/achievements`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as CreateAchievementResponse;
    },

    update: async (achievementId: number, payload: UpdateAchievementPayload): Promise<UpdateAchievementResponse> => {
        const formData = new FormData();
        if (payload.Title !== undefined) formData.append("Title", payload.Title);
        if (payload.Description !== undefined) formData.append("Description", payload.Description);
        if (payload.Media) {
            formData.append("Media", payload.Media);
        }

        const response = await fetch(`${BASE_URL}/api/achievements/${achievementId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as UpdateAchievementResponse;
    },

    delete: async (achievementId: number): Promise<DeleteAchievementResponse> => {
        const response = await fetch(`${BASE_URL}/api/achievements/${achievementId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as DeleteAchievementResponse;
    },
};