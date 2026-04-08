import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
// @NOTE: Models
import Task, { ITask } from "./Task.model";
import { IUser } from "./User.model";
import Note from "./Note";

// Define the Project interface extending mongoose Document
export interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[]; // Array of references to Task model
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
}

// Define the Project schema
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task' // Reference to Task model
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User' // Reference to User model
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User' // Reference to User model
        }
    ]
}, {
    timestamps: true
});

// @NOTE Middleware to delete tasks and notes that belong to a project
ProjectSchema.pre('deleteOne', { document: true }, async function () {
    console.log('Deleting project...', this);
    const projectId = this._id;
    if (!projectId) return;
    const tasks = await Task.find({ project: projectId });
    for (const task of tasks) {
        await Note.deleteMany({ task: task._id });
    }
    await Task.deleteMany({ project: projectId });
});

// Create and export the Project model
const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;