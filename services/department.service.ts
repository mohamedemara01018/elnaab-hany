import { GetDepartmentsResponse } from "@/types/department.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const departmentService = {
    getDepartments: async (): Promise<GetDepartmentsResponse> => {

        const response = await fetch(`${BASE_URL}/api/SeedData/GetDepartments`, {
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

        return data as GetDepartmentsResponse;
    },
};