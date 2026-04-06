import { Request, Response } from "express";
import Task from "../models/Task.model";


export class TaskController {

    static async getTasksByProject(req: Request, res: Response) {

        try {
            // Populate is optional, depending on whether you want project details in the task response
            const tasks = await Task.find({ project: req.project._id }).populate('project');
            res.status(200).json({
                message: 'Tasks fetched successfully',
                tasks
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Tasks not found' });
        }

    }

    static async getTaskById(req: Request, res: Response) {

        try {
            const task = await Task.findById(req.task._id)
                .populate(
                    { path: 'completedBy.user', select: '_id name email' }
                )
                .populate({
                    path: 'notes',
                    populate: {
                        path: 'createdBy',
                        select: '_id name email'
                    }
                });
            res.status(200).json({
                message: 'Task fetched successfully',
                task,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Task not found' });
        }

    }

    static async addTaskToProject(req: Request, res: Response) {

        try {
            // Create a new task associated with the project
            const newTask = new Task(req.body);
            newTask.project = req.project._id;
            // Add the task to the project's tasks array
            req.project.tasks.push(newTask._id);
            // Save both the new task and the updated project, because its no necessary to wait for both to complete
            Promise.allSettled([
                newTask.save(),
                req.project.save()
            ])
            res.status(201).json({
                message: 'Task added to project successfully',
                task: newTask
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error adding task to project' });
        }
    }

    static async updateTask(req: Request, res: Response) {
        try {
            // Update task with new data from request body
            req.task.name = req.body.name || req.task.name;
            req.task.description = req.body.description || req.task.description;
            req.task.status = req.body.status || req.task.status;

            await req.task.save();

            res.status(200).json({
                message: 'Task updated successfully',
                task: req.task
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error updating task' });
        }
    }

    static async deleteTask(req: Request, res: Response) {
        try {

            // También la eliminamos la referencia del arreglo de tareas del proyecto
            req.project.tasks = req.project.tasks.filter((tid) => tid.toString() !== req.task._id.toString());

            // Eliminamos la tarea y guardamos el proyecto actualizado
            await Promise.allSettled([
                req.task.deleteOne(),
                req.project.save()
            ]);

            res.status(200).json({
                message: 'Task deleted successfully',
                task: req.task
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error deleting task' });
        }
    }


    static async updateTaskStatus(req: Request, res: Response) {
        const { status } = req.body;

        try {
            req.task.status = status;

            // Field completedBy will store the user who completed the task and the status of the task
            const completedBy = {
                user: req.user._id,
                status
            };

            req.task.completedBy.push(completedBy);

            await req.task.save();

            res.status(200).json({
                message: 'Task status updated successfully',
                task: req.task
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error updating task status' });
        }

    }

}