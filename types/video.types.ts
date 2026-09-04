export interface VideoItem {
    id: number;
    title: string;
    mediaUrl: string;
    contentType: string;
    mediaType: number;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: T;
    message: string | null;
}

export type GetVideosResponse = ApiResponse<VideoItem[]>;
export type GetVideoByIdResponse = ApiResponse<VideoItem>;
export type CreateVideoResponse = ApiResponse<VideoItem>;
export type UpdateVideoResponse = ApiResponse<VideoItem>;
export type DeleteVideoResponse = ApiResponse<number>;

export interface CreateVideoPayload {
    Title: string;
    Media: File;
}

export interface UpdateVideoPayload {
    Title?: string;
    Media?: File;
}