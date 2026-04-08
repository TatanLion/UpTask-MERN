import { Request, Response } from "express";
import Project from "../models/Project.model";

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body);

        project.manager = req.user._id; // Assign the manager to the project

        try {
            await project.save();
            res.status(201).json({
                message: 'Project created successfully',
                project
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error creating project',
            });
        }

    }

    static getAllProjects = async (req: Request, res: Response) => {

        try {

            const projects = await Project.find({
                $or: [
                    { manager: req.user._id }, // Check if the user is the manager of the project
                    { team: { $in: [req.user._id] } } // Check if the user is a member of the project
                ]
            });
            res.status(200).json({
                message: 'Projects fetched successfully',
                projects
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error fetching projects',
            });
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            // Populate is used to fetch related tasks of the project
            const project = await Project.findById(id).populate('tasks');

            if (!project) {
                return res.status(404).json({
                    message: 'Project not found'
                });
            }

            if (project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id)) {
                return res.status(403).json({
                    message: 'Action not authorized'
                });
            }

            res.status(200).json({
                message: 'Project fetched successfully',
                project
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error fetching project',
            });
        }
    }

    static updateProject = async (req: Request, res: Response) => {

        const { id } = req.params;

        try {
            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({
                    message: 'Project not found'
                });
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    message: 'Only the manager can update the project'
                });
            }

            project.projectName = req.body.projectName;
            project.clientName = req.body.clientName;
            project.description = req.body.description;

            await project.save();

            res.status(200).json({
                message: 'Project updated successfully',
                project
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error updating project',
            });
        }

    }

    static deleteProject = async (req: Request, res: Response) => {

        const { id } = req.params;

        try {
            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({
                    message: 'Project not found'
                });
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    message: 'Only the manager can delete the project'
                });
            }

            await project.deleteOne();

            res.status(200).json({
                message: 'Project deleted successfully'
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error deleting project',
            });
        }
    }

}