import {
    BriefingRequestItem,
    BriefingRequestApiResponse,
    CreateBriefingRequestPayload,
    UpdateBriefingRequestPayload,
} from "@/types/briefing-requests.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const briefingRequestsService = {
    getAll: async (): Promise<BriefingRequestApiResponse<BriefingRequestItem[]>> => {
        const response = await fetch(`${BASE_URL}/api/Motion`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as BriefingRequestApiResponse<BriefingRequestItem[]>;
    },

    getById: async (motionId: number): Promise<BriefingRequestApiResponse<BriefingRequestItem>> => {
        const response = await fetch(`${BASE_URL}/api/Motion/${motionId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as BriefingRequestApiResponse<BriefingRequestItem>;
    },

    create: async (payload: CreateBriefingRequestPayload): Promise<BriefingRequestApiResponse<BriefingRequestItem>> => {
        const formData = new FormData();
        formData.append("Title", payload.Title);
        formData.append("Description", payload.Description);
        if (payload.Media) {
            formData.append("Media", payload.Media);
        }

        const response = await fetch(`${BASE_URL}/api/Motion`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as BriefingRequestApiResponse<BriefingRequestItem>;
    },

    update: async (motionId: number, payload: UpdateBriefingRequestPayload): Promise<BriefingRequestApiResponse<BriefingRequestItem>> => {
        const formData = new FormData();
        if (payload.Title !== undefined) formData.append("Title", payload.Title);
        if (payload.Description !== undefined) formData.append("Description", payload.Description);
        if (payload.Media) {
            formData.append("Media", payload.Media);
        }

        const response = await fetch(`${BASE_URL}/api/Motion/${motionId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as BriefingRequestApiResponse<BriefingRequestItem>;
    },

    delete: async (motionId: number): Promise<BriefingRequestApiResponse<number>> => {
        const response = await fetch(`${BASE_URL}/api/Motion/${motionId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as BriefingRequestApiResponse<number>;
    },
};