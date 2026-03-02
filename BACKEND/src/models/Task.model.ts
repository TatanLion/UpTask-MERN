import mongoose, { Document, Schema, Types } from "mongoose";

// Define TaskStatus as a constant object
const TaskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const;

// Export TaskStatus type
export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];



export interface ITask extends Document {
    name: string;
    description: string;
    project: Types.ObjectId; // Reference to Project model using Types.ObjectId
    status: TaskStatusType; // Use the TaskStatusType for status field
}

export const TaskSchema : Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project', // Reference to Project model
        required: true
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.PENDING
    }
}, {
    timestamps: true
});


const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;