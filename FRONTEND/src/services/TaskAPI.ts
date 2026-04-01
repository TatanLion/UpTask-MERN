import { isAxiosError } from "axios";
import api from "@/lib/axios";
// @NOTE: Types
import { taskSchema, type Project, type Task, type TaskFormData } from "../types";


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


export async function getTaskById(projectId: Project["_id"], taskId: Task['_id']) {
    try {
        const { data } = await api.get(`projects/${projectId}/tasks/${taskId}`);
        const response = taskSchema.safeParse(data.task);
        // console.log({responseData: response, rawData: data});
        if (!response.success) {
            throw new Error("Error al validar los datos de la tarea");
        }
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function updateTask(taskData: TaskFormData, projectId: Project["_id"], taskId: Task['_id']) {
    try {
        const { data } = await api.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function deleteTask(projectId: Project["_id"], taskId: Task['_id']) {
    try {
        const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function updateTaskStatus(status: Task['status'], projectId: Project["_id"], taskId: Task['_id']) {
    try {
        const { data } = await api.post(`/projects/${projectId}/tasks/${taskId}/status`, { status });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}