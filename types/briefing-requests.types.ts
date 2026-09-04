export interface BriefingRequestItem {
    id: number;
    title: string;
    description: string;
    mediaUrl: string;
    contentType: string;
    mediaType: number;
}

export interface BriefingRequestApiResponse<T> {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: T;
    message: string | null;
}

export interface CreateBriefingRequestPayload {
    Title: string;
    Description: string;
    Media: File | Blob;
}

export interface UpdateBriefingRequestPayload {
    Title?: string;
    Description?: string;
    Media?: File | Blob;
}