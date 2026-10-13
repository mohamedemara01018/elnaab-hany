import { GetDepartmentsResponse } from "@/types/department.types";
import { BASE_URL } from "@/utils/constant.utils";


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