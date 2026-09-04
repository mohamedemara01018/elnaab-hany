export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponseValue {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: LoginResponseValue;
    message: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ForgotPasswordResponse {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: string;
    message: string;
}

export interface VerifyResetCodePayload {
    email: string;
    code: string;
}

export interface VerifyResetCodeResponse {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: string;
    message: string;
}

export interface ResetPasswordPayload {
    email: string;
    code: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ResetPasswordResponse {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: string;
    message: string;
}