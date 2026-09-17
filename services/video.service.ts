import {
    GetVideosResponse,
    GetVideoByIdResponse,
    CreateVideoPayload,
    CreateVideoResponse,
    UpdateVideoPayload,
    UpdateVideoResponse,
    DeleteVideoResponse
} from "@/types/video.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const videoService = {
    getAll: async (): Promise<GetVideosResponse> => {
        const response = await fetch(`${BASE_URL}/api/DeputyWord`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as GetVideosResponse;
    },

    getById: async (videoId: number): Promise<GetVideoByIdResponse> => {
        const response = await fetch(`${BASE_URL}/api/DeputyWord/${videoId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as GetVideoByIdResponse;
    },

    create: async (payload: CreateVideoPayload): Promise<CreateVideoResponse> => {
        const formData = new FormData();
        formData.append("Title", payload.Title);
        if (payload.Media) {
            formData.append("Media", payload.Media);
        }

        const response = await fetch(`${BASE_URL}/api/DeputyWord`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as CreateVideoResponse;
    },

    update: async (videoId: number, payload: UpdateVideoPayload): Promise<UpdateVideoResponse> => {
        const formData = new FormData();
        if (payload.Title !== undefined) formData.append("Title", payload.Title);
        if (payload.Media) {
            formData.append("Media", payload.Media);
        }

        const response = await fetch(`${BASE_URL}/api/DeputyWord/${videoId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as UpdateVideoResponse;
    },

    delete: async (videoId: number): Promise<DeleteVideoResponse> => {
        const response = await fetch(`${BASE_URL}/api/DeputyWord/${videoId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as DeleteVideoResponse;
    },
};