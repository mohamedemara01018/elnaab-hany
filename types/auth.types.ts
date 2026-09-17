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

export interface CreateEmployeePayload {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: string;
    departmentId: number;
    organizationIds: number[]; // Updated to accept an array of numbers
    about?: string;
    image?: File | null;
}

export interface CreateEmployeeResponse {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: number | null;
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

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ChangePasswordResponse {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: string | null;
    message: string;
}