// الكائن الأساسي للنشاط/الزيارة المسترجع من الـ API
export interface ActivityVisit {
    id: number;
    title: string;
    description: string;
    mediaUrl: string;
    contentType: string;
    mediaType: number;
    location: string;
    date: string;
}

// الهيكل العام للاستجابة
export interface BaseApiResponse<T> {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: T;
    message: string;
}

// Responses Types
export type GetActivitiesVisitsResponse = BaseApiResponse<ActivityVisit[]>;
export type GetActivityVisitByIdResponse = BaseApiResponse<ActivityVisit>;
export type CreateActivityVisitResponse = BaseApiResponse<ActivityVisit>;
export type UpdateActivityVisitResponse = BaseApiResponse<ActivityVisit>;
export type DeleteActivityVisitResponse = BaseApiResponse<number>;

// Payloads Types (لإرسال البيانات عبر FormData)
export interface CreateActivityVisitPayload {
    Title?: string;
    Description?: string;
    Media?: File;
    Location: string;
    Date?: string; // ISO String format
}

export interface UpdateActivityVisitPayload {
    Title?: string;
    Description?: string;
    Media?: File;
    Location?: string;
    Date?: string; // ISO String format
}