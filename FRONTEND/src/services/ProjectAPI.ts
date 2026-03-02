import api from "@/lib/axios";
import type { ProjectFormData } from "@/types/index";

export async function createProject (projectData : ProjectFormData) {
    try {
        const { data } = await api.post("/projects", projectData);
        return data;
    } catch (error) {
        console.log(error);
    }
};