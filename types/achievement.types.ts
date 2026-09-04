export interface AchievementItem {
    id: number;
    title: string;
    description: string;
    mediaUrl: string;
    contentType: string;
    mediaType: number;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: T;
    message: string;
}

export type GetAchievementsResponse = ApiResponse<AchievementItem[]>;
export type GetAchievementByIdResponse = ApiResponse<AchievementItem>;
export type CreateAchievementResponse = ApiResponse<AchievementItem>;
export type UpdateAchievementResponse = ApiResponse<AchievementItem>;
export type DeleteAchievementResponse = ApiResponse<number>;

export interface CreateAchievementPayload {
    Title: string;
    Description: string;
    Media?: File | Blob;
}

export interface UpdateAchievementPayload {
    Title?: string;
    Description?: string;
    Media?: File | Blob;
}