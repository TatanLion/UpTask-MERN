import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task.model";
import { IUser } from "./User.model";

// Define the Project interface extending mongoose Document
export interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[]; // Array of references to Task model
    manager: PopulatedDoc<IUser & Document>;
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
    }
}, {
    timestamps: true
});

// Create and export the Project model
const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;