import { z } from 'zod';

// @NOTE: Auth
export const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    password2: z.string(),
    token: z.string(),
});
type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<Auth, "name" | "email" | "password" | "password2">;
export type ConfirmTokenForm = Pick<Auth, "token">;
export type RequestNewConfirmationCodeForm = Pick<Auth, "email">;
export type ForgotPasswordForm = Pick<Auth, "email">;
export type NewPasswordForm = Pick<Auth, "password" | "password2">;


// @NOTE: Users
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;


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


// @NOTE: Tasks
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"]);

export const taskSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(3, "El Nombre de la Tarea es obligatorio"),
    description: z.string().min(5, "La Descripción de la Tarea es obligatoria"),
    project: z.string().min(1, "El Proyecto es obligatorio"),
    status: taskStatusSchema.default("pending"),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick<Task, "name" | "description">;