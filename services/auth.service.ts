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
    ChangePasswordResponse
} from "@/types/auth.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const response = await fetch(`${BASE_URL}/Login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "*/*",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as LoginResponse;
    },

    forgotPassword: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
        const response = await fetch(`${BASE_URL}/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "*/*",
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
                "accept": "*/*",
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
                "accept": "*/*",
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
        console.log('token', token)
        const response = await fetch(`${BASE_URL}/ChangePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "*/*",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        });

        // Read raw text to handle empty body (204 or unexpected empty response)
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        console.log('data', data);
        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as ChangePasswordResponse;
    },
};