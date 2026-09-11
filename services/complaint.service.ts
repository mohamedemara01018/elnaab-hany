import {
    CreateComplaintPayload,
    UpdateRequestPayload,
    ComplaintDetail,
    ApiResponse,
} from "@/types/complaint.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const complaintService = {
    // POST /api/complaint (multipart/form-data - Public)
    createComplaint: async (payload: CreateComplaintPayload): Promise<ApiResponse<string>> => {
        const formData = new FormData();

        formData.append("RequestType", payload.RequestType.toString());
        formData.append("NationalId", payload.NationalId);
        formData.append("FullName", payload.FullName);
        if (payload.BirthDate) formData.append("BirthDate", payload.BirthDate);
        formData.append("Phone", payload.Phone);
        formData.append("Title", payload.Title);
        formData.append("Description", payload.Description);
        formData.append("DepartmentId", payload.DepartmentId.toString());
        formData.append("OrganizationId", payload.OrganizationId.toString());

        if (payload.Image) {
            formData.append("Image", payload.Image);
        }

        const response = await fetch(`${BASE_URL}/api/Complaint`, {
            method: "POST",
            headers: {
                "accept": "*/*",
            },
            body: formData,
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
            throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<string>;
    },

    // GET /{id}
    getComplaintById: async (id: number): Promise<ApiResponse<ComplaintDetail>> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
            throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<ComplaintDetail>;
    },

    // PUT /UpdateRequest
    updateRequest: async (payload: UpdateRequestPayload): Promise<ApiResponse<string>> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        const response = await fetch(`${BASE_URL}/UpdateRequest`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "accept": "*/*",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
            throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<string>;
    },

    // DELETE /{id}
    deleteComplaint: async (id: number): Promise<ApiResponse<string>> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
            throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<string>;
    },
};