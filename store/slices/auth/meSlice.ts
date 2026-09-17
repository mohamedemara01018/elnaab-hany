/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmployeeInfoValue } from "@/types/employee.types";
import { employeeService } from "@/services/employee.service";
import { RootState } from "../../store";

interface MeState {
    me: EmployeeInfoValue | null;
    isLoading: boolean;
    initialized: boolean;
    error: string | null;
}

const initialState: MeState = {
    me: null,
    isLoading: false,
    initialized: false,
    error: null,
};

export const fetchMe = createAsyncThunk<
    EmployeeInfoValue,
    void,
    { rejectValue: string }
>(
    "me/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await employeeService.getEmployeeInfo();

            if (!response.isSuccess) {
                return rejectWithValue(response.message || "Failed to fetch user info.");
            }

            return response.value;
        } catch (error: any) {
            return rejectWithValue(
                error?.message || "Failed to fetch user info."
            );
        }
    }
);

const meSlice = createSlice({
    name: "me",
    initialState,
    reducers: {
        clearMe(state) {
            state.me = null;
            state.error = null;
        },
        clearMeError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.initialized = true;
                state.me = action.payload;
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.isLoading = false;
                state.initialized = true;
                state.me = null;
                state.error = action.payload ?? "Something went wrong.";
            });
    },
});

export const { clearMe, clearMeError } = meSlice.actions;

// Selectors
export const selectMeSlice = (state: RootState) => state.me;

export default meSlice.reducer;