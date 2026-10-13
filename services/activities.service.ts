import { ApiResponse, Activity, CreateActivityDto, UpdateActivityDto } from "@/types/activities.types";
import { BASE_URL } from "@/utils/constant.utils";

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
        const response = await fetch(`${BASE_URL}/api/areas-of-work`, {
            method: "GET",
            headers: {
                accept: "*/*",
            },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<Activity[]>;
    },

    /**
     * Get single activity / area of work by ID
     */
    getById: async (areaId: number): Promise<ApiResponse<Activity>> => {
        const response = await fetch(`${BASE_URL}/api/areas-of-work/${areaId}`, {
            method: "GET",
            headers: {
                accept: "*/*",
            },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<Activity>;
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

        const response = await fetch(`${BASE_URL}/api/areas-of-work`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: formData,
        });

        const responseData = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(responseData?.message || `HTTP error! status: ${response.status}`);
        }

        return responseData as ApiResponse<Activity>;
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

        const response = await fetch(`${BASE_URL}/api/areas-of-work/${areaId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: formData,
        });

        const responseData = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(responseData?.message || `HTTP error! status: ${response.status}`);
        }

        return responseData as ApiResponse<Activity>;
    },

    /**
     * Delete activity / area of work by ID
     */
    delete: async (areaId: number): Promise<ApiResponse<number>> => {
        const response = await fetch(`${BASE_URL}/api/areas-of-work/${areaId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<number>;
    },
};