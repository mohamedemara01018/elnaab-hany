export interface HeroInfoData {
    fullName: string;
    birthOfDate: string; // "YYYY-MM-DD"
    primaryPhone: string;
    secondaryPhone?: string;
    address: string;
    title: string;
    bio: string;
    aboutPart1: string;
    aboutPart2: string;
    officeLocation: string;
    whatsApp: string;
    facebookLing: string;
    locationURL: string;
    circle: string;
    appointment: string;
    mediaUrl: string | null;
    contentType?: string;
    mediaType?: number;
}

export interface GetHeroInfoResponse {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: HeroInfoData;
    message: string;
}

export interface UpdateHeroInfoPayload {
    FullName?: string;
    BirthOfDate?: string;
    PrimaryPhone?: string;
    SecondaryPhone?: string;
    Address?: string;
    Title?: string;
    Bio?: string;
    AboutPart1?: string;
    AboutPart2?: string;
    OfficeLocation?: string;
    WhatsApp?: string;
    FacebookLing?: string;
    LocationURL?: string;
    Circle?: string;
    Appointment?: string;
    Media?: File | Blob;
}

export interface UpdateHeroInfoResponse {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: HeroInfoData | null;
    message: string;
}