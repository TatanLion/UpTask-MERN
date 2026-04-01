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
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(),
});

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true,
    })
);

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<Project, "projectName" | "clientName" | "description">;


// @NOTE: Tasks
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"]);

export const taskSchema = z.object({
    _id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema.default("pending"),
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema,
    })),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick<Task, "name" | "description">;



// @NOTE: Team
export const teamMemberSchema = userSchema.pick({
    _id: true,
    name: true,
    email: true,
});

export const teamMembersSchema = z.array(teamMemberSchema);
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberFormData = Pick<TeamMember, "email">;