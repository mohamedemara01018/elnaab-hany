export interface Department {
    id: number;
    name: string;
    employees?: unknown[];
    citizinRequierments?: unknown[];
}

export type GetDepartmentsResponse = Department[];