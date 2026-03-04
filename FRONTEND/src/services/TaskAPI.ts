import { isAxiosError } from "axios";
import api from "@/lib/axios";
// @NOTE: Types
import type { Project, TaskFormData } from "../types";


export async function createTask(taskData: TaskFormData, projectId: Project["_id"]) {
    try {
        const { data } = await api.post(`/projects/${projectId}/tasks`, taskData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}