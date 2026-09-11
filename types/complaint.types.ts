export interface CreateComplaintPayload {
    RequestType: number;
    NationalId: string;
    FullName: string;
    BirthDate?: string;
    Phone: string;
    Title: string;
    Description: string;
    DepartmentId: number;
    OrganizationId: number;
    Image?: File | null;
}

export interface UpdateRequestPayload {
    citizinRequiermentId: number;
    status: number;
    priority: number;
    comment?: string;
}

export interface CitizenInfo {
    nationalId: string;
    fullName: string;
    birthDate?: string;
    phone: string;
}

export interface RequestInfo {
    type: number;
    title: string;
    description: string;
    status: number;
    priority: number;
    createdAt: string;
}

export interface MediaInfo {
    blobName: string;
    fileName: string;
    contentType: string;
    fileSizeBytes: number;
    mediaType: number;
    uploadedAt: string;
}

export interface ComplaintDetail {
    id: number;
    citizen: CitizenInfo;
    request: RequestInfo;
    media?: MediaInfo | null;
}

export interface ApiResponse<T = unknown> {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: T;
    message: string | null;
}