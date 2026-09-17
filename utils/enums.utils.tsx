export enum RoleType {
    DEPUTY = 'deputy',
    LANDING_DASH = 'landing_dash',
    LANDING = 'landing',
    EMPLOYEE = 'employee',
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

export enum UserRole {
    ADMIN = 'Admin',
    SOCIAL = 'Social',
    EMPLOYEE = 'Employee'
}