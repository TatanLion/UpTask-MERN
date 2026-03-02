import { z } from 'zod';

// @NOTE: Projects
export const projectSchema = z.object({
    _id: z.string().optional(),
    projectName: z.string().min(1, "El Titulo del Proyecto es obligatorio"),
    clientName: z.string().min(1, "El Nombre del Cliente es obligatorio"),
    description: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<Project, "projectName" | "clientName" | "description">;