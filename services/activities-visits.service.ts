import {
    GetActivitiesVisitsResponse,
    GetActivityVisitByIdResponse,
    CreateActivityVisitPayload,
    CreateActivityVisitResponse,
    UpdateActivityVisitPayload,
    UpdateActivityVisitResponse,
    DeleteActivityVisitResponse,
} from "@/types/activity-visit.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const activityVisitService = {
    getAll: async (): Promise<GetActivitiesVisitsResponse> => {
        const response = await fetch(`${BASE_URL}/api/activities-visits`, {
            method: "GET",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as GetActivitiesVisitsResponse;
    },

    getById: async (activityVisitId: number): Promise<GetActivityVisitByIdResponse> => {
        const response = await fetch(`${BASE_URL}/api/activities-visits/${activityVisitId}`, {
            method: "GET",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as GetActivityVisitByIdResponse;
    },

    create: async (payload: CreateActivityVisitPayload): Promise<CreateActivityVisitResponse> => {
        const formData = new FormData();
        if (payload.Title !== undefined) formData.append("Title", payload.Title);
        if (payload.Description !== undefined) formData.append("Description", payload.Description);
        if (payload.Media) formData.append("Media", payload.Media);
        formData.append("Location", payload.Location);
        if (payload.Date) formData.append("Date", payload.Date);

        const response = await fetch(`${BASE_URL}/api/activities-visits`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as CreateActivityVisitResponse;
    },

    update: async (
        activityVisitId: number,
        payload: UpdateActivityVisitPayload
    ): Promise<UpdateActivityVisitResponse> => {
        const formData = new FormData();
        if (payload.Title !== undefined) formData.append("Title", payload.Title);
        if (payload.Description !== undefined) formData.append("Description", payload.Description);
        if (payload.Media) formData.append("Media", payload.Media);
        if (payload.Location !== undefined) formData.append("Location", payload.Location);
        if (payload.Date !== undefined) formData.append("Date", payload.Date);

        const response = await fetch(`${BASE_URL}/api/activities-visits/${activityVisitId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as UpdateActivityVisitResponse;
    },

    delete: async (activityVisitId: number): Promise<DeleteActivityVisitResponse> => {
        const response = await fetch(`${BASE_URL}/api/activities-visits/${activityVisitId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as DeleteActivityVisitResponse;
    },
};