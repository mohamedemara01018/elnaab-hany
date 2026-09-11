export interface Organization {
    id: number;
    name: string;
    employeeOrganizations?: unknown[];
}

export type GetOrganizationsResponse = Organization[];