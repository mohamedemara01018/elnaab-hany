import { ComplaintPriority, RequestStatus, RequestType } from "@/utils/enums.utils";


export interface CommentInfo {
    id: number;
    comment: string;
    createdAt: string;
    employeeId: number;
    employeeName: string;
}

export interface CitizenInfo {
    nationalId: string;
    fullName: string;
    birthDate?: string;
    phone: string;
}

export interface RequestInfo {
    type: RequestType;
    title: string;
    description: string;
    status: RequestStatus;
    priority: ComplaintPriority;
    createdAt: string;
}

export interface MediaInfo {
    blobName: string;
    fileName: string;
    contentType: string;
    fileSizeBytes?: number;
    mediaType?: number;
    uploadedAt?: string;
    mediaUrl: string;
}

export interface ComplaintDetail {
    id: number;
    citizen: CitizenInfo;
    request: RequestInfo;
    media?: MediaInfo | null;
    comments?: CommentInfo[];
}

export interface PaginatedValue<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface ApiResponse<T = unknown> {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: T;
    message: string | null;
}

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