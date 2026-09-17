import type { ComplaintStatus } from "@/components/employee-dashboard/complaints-management-page/Statusbadge";
import type { CommentInfo } from "@/types/employee.types";

export interface DeputyRequestsQueryParams {
    PageNumber?: number;
    PageSize?: number;
    Type?: number;
    Status?: number;
    Priority?: number;
    Search?: string;
    DepartmentId?: number;
    OrganizationId?: number;
}

// 1. RequestType
export enum RequestType {
    Complaint = 1,
    Suggestion = 2,
}

// 2. ComplaintPriority
export enum ComplaintPriority {
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4,
}

// 3. RequestStatus
export enum RequestStatus {
    New = 1,
    InProgress = 2,
    Resolved = 3,
    Rejected = 4,
    Closed = 5,
}

export interface DeputyCitizenInfo {
    nationalId?: string;
    fullName?: string;
    phone?: string;
    birthDate?: string;
}

export interface DeputyRequestDetail {
    type?: number;
    title?: string;
    description?: string;
    status?: number;
    priority?: number;
    createdAt?: string;
    comments?: Array<unknown>;
}

export interface DeputyAssignedEmployee {
    employeeId?: number;
    fullName?: string;
    phone?: string;
    departmentName?: string;
    organizationName?: string;
}

export interface DeputyRequestItem {
    id: number;
    citizen?: DeputyCitizenInfo;
    request?: DeputyRequestDetail;
    media?: {
        mediaUrl?: string;
    } | null;
    assignedEmployees?: DeputyAssignedEmployee[];
}

export interface DeputyRequestsResponse {
    isSuccess: boolean;
    status: number;
    error?: string | null;
    value?: {
        items?: DeputyRequestItem[];
        pageNumber?: number;
        pageSize?: number;
        totalPages?: number;
        totalCount?: number;
        hasPreviousPage?: boolean;
        hasNextPage?: boolean;
    };
    message?: string | null;
}

export interface DeputyStatisticsValue {
    total?: number;
    new?: number;
    inProgress?: number;
    completed?: number;
}

export interface DeputyStatisticsResponse {
    isSuccess: boolean;
    status: number;
    error?: string | null;
    value?: DeputyStatisticsValue;
    message?: string | null;
}

// Employee Ranking Interfaces
export interface EmployeeRankingItem {
    employeeId: number;
    employeeName: string;
    department: string;
    requestsCount: number;
    contributionPercentage: number;
    rank: number;
    imageUrl: string | null;
}

export interface EmployeeRankingResponse {
    isSuccess: boolean;
    status: number;
    error?: string | null;
    value?: {
        employees?: EmployeeRankingItem[];
    };
    message?: string | null;
}

// Flat row shape for the deputy complaints table/modals
export interface ComplaintRow {
    id: string;
    citizenName: string;
    phone: string;
    nationalId: string;
    requestType: string;
    jurisdiction: string;
    departmentName: string;
    organizationName: string;
    date: string;
    /** First assigned employee's name — kept for callers still reading a single name; prefer `employees`. */
    employee: string;
    employees: DeputyAssignedEmployee[];
    status: ComplaintStatus;
    rawStatus?: number;
    priority?: number;
    title?: string;
    description?: string;
    mediaUrl?: string;
    comments: CommentInfo[];
}