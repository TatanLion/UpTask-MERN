import { isAxiosError } from "axios";
import api from "@/lib/axios";
// @NOTE: Types
import { dashboardProjectSchema, type Project, type ProjectFormData } from "@/types/index";

export async function createProject (projectData : ProjectFormData) {
    try {
        const { data } = await api.post("/projects", projectData);
        return data;
    } catch (error) {
        // @NOTE: Como esto es ejecución de código en el cliente, es posible que el error sea un error de Axios, por lo que se verifica si es un error de Axios y si tiene una respuesta
        if(isAxiosError(error) && error.response) {
            // @NOTE: Este mensaje se envia desde el backend, por lo que se accede a error.response.data.message y se envia como mensaje de error al frontend
            throw new Error(error.response.data.message);
        }
    }
};


export async function getProjects () {
    try {
        const { data } = await api.get("/projects");
        const response = dashboardProjectSchema.safeParse(data.projects);
        if(!response.success) {
            throw new Error("Error al validar los proyectos");
        }
        return response.data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};


export async function getProjectById (projectId : Project["_id"]) {
    try {
        const { data } = await api.get(`/projects/${projectId}`);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};


export async function updateProject (projectId : Project["_id"], projectData : ProjectFormData) {
    try {
        const { data } = await api.put(`/projects/${projectId}`, projectData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function deleteProject (projectId : Project["_id"]) {
    try {
        const { data } = await api.delete(`/projects/${projectId}`);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}