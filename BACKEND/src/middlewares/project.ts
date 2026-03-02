import { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Project.model';

// Extend Express Request interface to include project property
declare global {
    namespace Express {
        interface Request {
            project: IProject;
        }
    }
}

export async function validateProjectExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        req.project = project; // Attach the project to the request object for use in subsequent handlers
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
