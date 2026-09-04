export interface Activity {
    id: number;
    title: string;
    description: string;
    mediaUrl: string;
    contentType?: string;
    mediaType?: number;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: T;
    message?: string;
}

export interface CreateActivityDto {
    Title: string;
    Description: string;
    Image?: File;
}

export interface UpdateActivityDto {
    Title?: string;
    Description?: string;
    Image?: File;
}