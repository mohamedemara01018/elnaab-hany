import {
    DeputyRequestsQueryParams,
    DeputyRequestsResponse,
    DeputyStatisticsResponse,
    EmployeeRankingResponse,
} from "@/types/deputy.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const deputyService = {
    getDeputyRequests: async (
        params?: DeputyRequestsQueryParams
    ): Promise<DeputyRequestsResponse> => {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    queryParams.append(key, String(value));
                }
            });
        }

        const queryString = queryParams.toString();
        const endpoint = `${BASE_URL}/api/Deputy/requests${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(endpoint, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as DeputyRequestsResponse;
    },

    getDeputyStatistics: async (): Promise<DeputyStatisticsResponse> => {
        const response = await fetch(`${BASE_URL}/api/Deputy/statistics`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as DeputyStatisticsResponse;
    },

    getEmployeesRanking: async (): Promise<EmployeeRankingResponse> => {
        const response = await fetch(`${BASE_URL}/api/Deputy/employees/ranking`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data as EmployeeRankingResponse;
    },
};