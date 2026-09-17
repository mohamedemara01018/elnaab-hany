import { ApiResponse, Activity, CreateActivityDto, UpdateActivityDto } from "@/types/activities.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/areas-of-work`
    : "https://deputyproject20260826153754-hvayeugeehdpf2hy.italynorth-01.azurewebsites.net/api/areas-of-work";

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};
export const activitiesService = {
    /**
     * Get all activities / areas of work
     */
    getAll: async (): Promise<ApiResponse<Activity[]>> => {
        const response = await fetch(BASE_URL, {
            method: "GET",
            headers: {
                accept: "*/*",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Get single activity / area of work by ID
     */
    getById: async (areaId: number): Promise<ApiResponse<Activity>> => {
        const response = await fetch(`${BASE_URL}/${areaId}`, {
            method: "GET",
            headers: {
                accept: "*/*",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Create new activity / area of work (multipart/form-data)
     */
    create: async (data: CreateActivityDto): Promise<ApiResponse<Activity>> => {
        const formData = new FormData();
        formData.append("Title", data.Title);
        formData.append("Description", data.Description);

        if (data.Image) {
            formData.append("Image", data.Image);
        }

        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Update existing activity / area of work by ID (multipart/form-data)
     */
    update: async (areaId: number, data: UpdateActivityDto): Promise<ApiResponse<Activity>> => {
        const formData = new FormData();

        if (data.Title !== undefined) {
            formData.append("Title", data.Title);
        }
        if (data.Description !== undefined) {
            formData.append("Description", data.Description);
        }
        if (data.Image) {
            formData.append("Image", data.Image);
        }

        const response = await fetch(`${BASE_URL}/${areaId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Delete activity / area of work by ID
     */
    delete: async (areaId: number): Promise<ApiResponse<number>> => {
        const response = await fetch(`${BASE_URL}/${areaId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },
};