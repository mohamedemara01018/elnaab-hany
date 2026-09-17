import {
    CreateComplaintPayload,
    UpdateRequestPayload,
    ComplaintDetail,
    ApiResponse,
} from "@/types/complaint.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const complaintService = {
    /**
     * POST /api/Complaint
     * إضافة شكوى / اقتراح جديد (Public Endpoint)
     */
    createComplaint: async (payload: CreateComplaintPayload): Promise<ApiResponse<string>> => {
        const formData = new FormData();

        formData.append("RequestType", payload.RequestType.toString());
        formData.append("NationalId", payload.NationalId);
        formData.append("FullName", payload.FullName);

        if (payload.BirthDate?.trim()) {
            formData.append("BirthDate", payload.BirthDate.trim());
        }

        formData.append("Phone", payload.Phone);
        formData.append("Title", payload.Title);
        formData.append("Description", payload.Description);
        formData.append("DepartmentId", payload.DepartmentId.toString());
        formData.append("OrganizationId", payload.OrganizationId.toString());

        if (payload.Image && payload.Image instanceof File && payload.Image.size > 0) {
            formData.append("Image", payload.Image);
        }

        const response = await fetch(`${BASE_URL}/api/Complaint`, {
            method: "POST",
            headers: {
                accept: "*/*",
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

    /**
     * GET /{id} or /api/Complaint/{id}
     * جلب تفاصيل طلب محدد برقم الـ ID
     */
    getComplaintById: async (id: number): Promise<ApiResponse<ComplaintDetail>> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
            throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<ComplaintDetail>;
    },

    /**
     * PUT /UpdateRequest
     * تحديث حالة وأولوية الشكوى/الاقتراح
     */
    updateRequest: async (payload: UpdateRequestPayload): Promise<ApiResponse<string>> => {
        const response = await fetch(`${BASE_URL}/UpdateRequest`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
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

    /**
     * DELETE /{id}
     * حذف طلب الشكوى/الاقتراح
     */
    deleteComplaint: async (id: number): Promise<ApiResponse<string>> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
            throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
        }

        return data as ApiResponse<string>;
    },
};