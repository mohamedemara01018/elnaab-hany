import {
    EmployeeRequestsQueryParams,
    EmployeeRequestsResponse,
    EmployeeStatisticsResponse,
    AllEmployeesResponse,
    EmployeeInfoResponse,
    DeleteEmployeeResponse,
    UpdateEmployeeProfilePayload,
    UpdateEmployeeProfileResponse,
} from "@/types/employee.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const employeeService = {
    /**
     * جلب كافة بيانات الموظف الشخصية
     * GET /api/Employee/employee-info
     */
    getEmployeeInfo: async (): Promise<EmployeeInfoResponse> => {
        const response = await fetch(`${BASE_URL}/api/Employee/employee-info`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as EmployeeInfoResponse;
    },

    /**
     * جلب طلبات الموظف مع إمكانية الفلترة والصفحات
     * GET /api/Employee/employee-requests
     */
    getEmployeeRequests: async (
        params: EmployeeRequestsQueryParams = {}
    ): Promise<EmployeeRequestsResponse> => {
        const query = new URLSearchParams();

        if (params.PageNumber !== undefined) query.append("PageNumber", params.PageNumber.toString());
        if (params.PageSize !== undefined) query.append("PageSize", params.PageSize.toString());
        if (params.Type !== undefined && params.Type !== null) query.append("Type", params.Type.toString());
        if (params.Status !== undefined && params.Status !== null) query.append("Status", params.Status.toString());
        if (params.Priority !== undefined && params.Priority !== null) query.append("Priority", params.Priority.toString());

        const queryString = query.toString();
        const endpoint = `${BASE_URL}/api/Employee/employee-requests${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(endpoint, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as EmployeeRequestsResponse;
    },

    /**
     * جلب إحصائيات الموظف
     * GET /api/Employee/statistics
     */
    getEmployeeStatistics: async (): Promise<EmployeeStatisticsResponse> => {
        const response = await fetch(`${BASE_URL}/api/Employee/statistics`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as EmployeeStatisticsResponse;
    },

    /**
     * جلب كافة الموظفين
     * GET /api/Employee/AllEmployee
     */
    getAllEmployees: async (): Promise<AllEmployeesResponse> => {
        const response = await fetch(`${BASE_URL}/api/Employee/AllEmployee`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as AllEmployeesResponse;
    },

    /**
     * حذف موظف
     * DELETE /api/Employee/{EmployeeId}
     */
    deleteEmployee: async (employeeId: string): Promise<DeleteEmployeeResponse> => {
        const response = await fetch(`${BASE_URL}/api/Employee/${employeeId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as DeleteEmployeeResponse;
    },

    /**
     * تحديث الملف الشخصي للموظف
     * PUT /api/employee/Profile
     */
    updateEmployeeProfile: async (
        payload: UpdateEmployeeProfilePayload
    ): Promise<UpdateEmployeeProfileResponse> => {
        const formData = new FormData();

        formData.append("EmployeeId", payload.EmployeeId);
        if (payload.fullname) formData.append("fullname", payload.fullname);
        if (payload.About) formData.append("About", payload.About);
        if (payload.Phone) formData.append("Phone", payload.Phone);
        if (payload.DepartmentId !== undefined) {
            formData.append("DepartmentId", payload.DepartmentId.toString());
        }

        if (payload.OrganizationIds && payload.OrganizationIds.length > 0) {
            payload.OrganizationIds.forEach((id) => {
                formData.append("OrganizationIds", id.toString());
            });
        }

        if (payload.Image) {
            formData.append("Image", payload.Image);
        }

        const headers = getAuthHeaders();
        delete headers["Content-Type"];

        const response = await fetch(`${BASE_URL}/api/employee/Profile`, {
            method: "PUT",
            headers,
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as UpdateEmployeeProfileResponse;
    },
};