import {
    LoginPayload,
    LoginResponse,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    VerifyResetCodePayload,
    VerifyResetCodeResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
    ChangePasswordPayload,
    ChangePasswordResponse,
    CreateEmployeePayload,
    CreateEmployeeResponse,
} from "@/types/auth.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const response = await fetch(`${BASE_URL}/Login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "*/*",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as LoginResponse;
    },

    createEmployee: async (payload: CreateEmployeePayload): Promise<CreateEmployeeResponse> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        const formData = new FormData();
        formData.append("FullName", payload.fullName);
        formData.append("Email", payload.email);
        formData.append("Password", payload.password);
        formData.append("Role", payload.role);
        formData.append("DepartmentId", payload.departmentId.toString());

        // Append each ID under the singular key "OrganizationId" expected by the Swagger API
        if (Array.isArray(payload.organizationIds)) {
            payload.organizationIds.forEach((id) => {
                formData.append("OrganizationId", id.toString());
            });
        }

        if (payload.phoneNumber?.trim()) {
            formData.append("PhoneNumber", payload.phoneNumber.trim());
        }

        if (payload.about?.trim()) {
            formData.append("About", payload.about.trim());
        }

        if (payload.image && payload.image instanceof File && payload.image.size > 0) {
            formData.append("Image", payload.image);
        }

        const response = await fetch(`${BASE_URL}/api/Employee/CreateEmployee`, {
            method: "POST",
            headers: {
                accept: "*/*",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as CreateEmployeeResponse;
    },

    forgotPassword: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
        const response = await fetch(`${BASE_URL}/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "*/*",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as ForgotPasswordResponse;
    },

    verifyResetCode: async (payload: VerifyResetCodePayload): Promise<VerifyResetCodeResponse> => {
        const response = await fetch(`${BASE_URL}/verify-reset-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "*/*",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as VerifyResetCodeResponse;
    },

    resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
        const response = await fetch(`${BASE_URL}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "*/*",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as ResetPasswordResponse;
    },

    changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        const response = await fetch(`${BASE_URL}/ChangePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "*/*",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as ChangePasswordResponse;
    },
};