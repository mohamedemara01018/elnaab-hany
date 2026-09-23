/* eslint-disable @typescript-eslint/no-explicit-any */
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

/**
 * Helper function to handle multipart requests via XMLHttpRequest for upload progress tracking.
 */
const uploadWithProgress = <T>(
    url: string,
    method: "POST" | "PUT",
    formData: FormData,
    onProgress?: (progress: number) => void
): Promise<T> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        // Attach Auth Headers
        const headers = getAuthHeaders();
        Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });

        // Track upload progress
        if (xhr.upload && onProgress) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };
        }

        xhr.onload = () => {
            let data: any = null;
            try {
                data = JSON.parse(xhr.responseText);
            } catch {
                data = null;
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(data as T);
            } else {
                reject(new Error(data?.message || `HTTP error! status: ${xhr.status}`));
            }
        };

        xhr.onerror = () => {
            reject(new Error("حدث خطأ في الاتصال بالشبكة أثناء رفع الملف."));
        };

        xhr.send(formData);
    });
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

    create: async (
        payload: CreateVideoPayload,
        onProgress?: (progress: number) => void
    ): Promise<CreateVideoResponse> => {
        const formData = new FormData();
        formData.append("Title", payload.Title);
        if (payload.Media) {
            formData.append("Media", payload.Media);
        }

        return uploadWithProgress<CreateVideoResponse>(
            `${BASE_URL}/api/DeputyWord`,
            "POST",
            formData,
            onProgress
        );
    },

    update: async (
        videoId: number,
        payload: UpdateVideoPayload,
        onProgress?: (progress: number) => void
    ): Promise<UpdateVideoResponse> => {
        const formData = new FormData();
        if (payload.Title !== undefined) formData.append("Title", payload.Title);
        if (payload.Media) {
            formData.append("Media", payload.Media);
        }

        return uploadWithProgress<UpdateVideoResponse>(
            `${BASE_URL}/api/DeputyWord/${videoId}`,
            "PUT",
            formData,
            onProgress
        );
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