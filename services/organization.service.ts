import { GetOrganizationsResponse } from "@/types/organization.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const organizationService = {
    getOrganizations: async (): Promise<GetOrganizationsResponse> => {

        const response = await fetch(`${BASE_URL}/api/SeedData/GetOrganizations`, {
            method: "GET",
            headers: {
                "accept": "*/*",
            },
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as GetOrganizationsResponse;
    },
};