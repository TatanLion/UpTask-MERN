import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { type TeamMemberFormData, type Project, type TeamMember, teamMembersSchema } from "../types";


export async function findUserByEmail(projectId: Project['_id'], email: TeamMemberFormData["email"]) {
    try {
        const { data } = await api.post(`/projects/${projectId}/team/find`, { email });
        // console.log(data);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}



export async function addUserToProject(projectId: Project['_id'], id: TeamMember['_id']) {
    try {
        const { data } = await api.post(`/projects/${projectId}/team`, { id });
        // console.log(data);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}



export async function getProjectTeam(projectId: Project['_id']) {
    try {
        const { data } = await api.get(`/projects/${projectId}/team`);
        const response = teamMembersSchema.safeParse(data);
        if (!response.success) {
            throw new Error("Error al validar los miembros del equipo");
        }
        // console.log(data);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}



export async function removeUserFromProject(projectId: Project['_id'], id: TeamMember['_id']) {
    try {
        const { data } = await api.delete(`/projects/${projectId}/team/${id}`);
        // console.log(data);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}