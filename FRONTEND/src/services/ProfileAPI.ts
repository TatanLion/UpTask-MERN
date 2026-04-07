import { isAxiosError } from "axios";
// @NOTE: Lib
import api from "@/lib/axios";
// @NOTE: Types
import type { ChangePasswordForm, UserProfileFormData } from "../types";


export async function updateProfile(formData : UserProfileFormData) {
    try {
        const { data } = await api.put("/auth/profile", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

    export async function changePassword(formData: ChangePasswordForm) {
        try {
            const { data } = await api.post("/auth/change-password", formData);
            return data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }