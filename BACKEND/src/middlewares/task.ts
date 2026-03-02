import { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/Task.model';

// Extend Express Request interface to include task property
declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}

export async function validateTaskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        req.task = task; // Attach the task to the request object for use in subsequent handlers
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


export function validateTaskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project._id.toString()) {
        console.error('Task doesn\'t belong to the project');
        return res.status(400).json(
            { message: 'Action not allowed' }
        );
    }
    next();
}