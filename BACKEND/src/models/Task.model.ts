import mongoose, { Document, Schema, Types } from "mongoose";
// @NOTE: Models
import Note from "./Note";

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
    completedBy: {
        user: Types.ObjectId;
        status: TaskStatusType;
    }[];
    notes: Types.ObjectId[];
}

export const TaskSchema: Schema = new Schema({
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
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(TaskStatus),
                default: TaskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, {
    timestamps: true
});


// @NOTE: Middleware to delete notes when deleting a task
TaskSchema.pre('deleteOne', { document: true }, async function () {
    // console.log('Deleting task...', this);
    const taskId = this._id;
    await Note.deleteMany({ task: taskId });
});

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;