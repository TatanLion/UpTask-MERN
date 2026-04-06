import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { Note, NoteFormData, Project, Task } from "../types";

interface NoteAPI {
    formData: NoteFormData;
    projectId: Project['_id'];
    taskId: Task['_id'];
}

export async function createNote({ projectId, taskId, formData } : NoteAPI) {
    try {
        const { data } = await api.post(`/projects/${projectId}/tasks/${taskId}/notes`, formData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function deleteNote({ projectId, taskId, noteId } : 
    { projectId: Project['_id'], taskId: Task['_id'], noteId: Note['_id'] }
) {
    try {
        const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}/notes/${noteId}`);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}