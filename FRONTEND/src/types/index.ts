import { z } from 'zod';

// @NOTE: Projects
export const projectSchema = z.object({
    _id: z.string().optional(),
    projectName: z.string().min(3, "El Titulo del Proyecto es obligatorio"),
    clientName: z.string().min(3, "El Nombre del Cliente es obligatorio"),
    description: z.string().min(5, "La Descripción del Proyecto es obligatoria"),
});

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
    })
);

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<Project, "projectName" | "clientName" | "description">;