// --- Shared Base API Response ---
export interface ApiResponse<T> {
    isSuccess: boolean;
    status: number;
    error: string | null;
    value: T;
    message: string | null;
}

// --- 1. Get Employee Requests Types ---
export interface EmployeeRequestsQueryParams {
    PageNumber?: number;
    PageSize?: number;
    Type?: number;
    Status?: number;
    Priority?: number;
}

export interface CitizenInfo {
    id: number;
    nationalId: string;
    fullName: string;
    phone: string;
}

export interface CommentInfo {
    id: number;
    comment: string;
    createdAt: string;
    employeeId: number;
    employeeName: string;
}

export interface RequestInfo {
    type: number;
    title: string;
    description: string;
    status: number;
    priority: number;
    createdAt: string;
    departmentName: string | null;
    organizationName: string | null;
}

export interface MediaInfo {
    blobName: string | null;
    fileName: string | null;
    contentType: string | null;
    mediaUrl: string | null;
}

export interface EmployeeRequestItem {
    id: number;
    citizen: CitizenInfo;
    request: RequestInfo;
    media: MediaInfo;
    comments: CommentInfo[];
}

export interface EmployeeRequestsValue {
    items: EmployeeRequestItem[];
}

export type EmployeeRequestsResponse = ApiResponse<EmployeeRequestsValue>;

// --- 2. Get Employee Statistics Types ---
export interface EmployeeStatisticsValue {
    total: number;
    new: number;
    inProgress: number;
    completed: number;
}

export type EmployeeStatisticsResponse = ApiResponse<EmployeeStatisticsValue>;

// --- 3. Get All Employees Types ---
export interface EmployeeItem {
    id: string;
    fullName: string;
    email: string;
    imageUrl: string | null;
    about: string | null;
    phone: string | null;
    departmentName?: string | null;
    organizations?: string[];
}

export type AllEmployeesResponse = ApiResponse<EmployeeItem[]>;

// --- 4. Get Employee Info Types ---
export interface EmployeeInfoValue {
    userid: string;
    name: string;
    department: string;
    imageUrl: string | null;
    organizations: string[];
    role: string;
    email: string;
    phone: string | null;
    about: string | null;
}

export type EmployeeInfoResponse = ApiResponse<EmployeeInfoValue>;

// --- 5. Delete Employee Types ---
export type DeleteEmployeeResponse = ApiResponse<number>;

// --- 6. Update Employee Profile Types ---
export interface UpdateEmployeeProfilePayload {
    EmployeeId: string;
    fullname?: string;
    About?: string;
    Phone?: string;
    DepartmentId?: number;
    OrganizationIds?: number[];
    Image?: File | null;
}

export type UpdateEmployeeProfileResponse = ApiResponse<number>;