import { Request, Response } from "express";
import User from "../models/User.model";
import Project from "../models/Project.model";

export class TeamController {

    static async getProjectTeam(req: Request, res: Response) {
        try {
            const project = await Project.findById(req.project._id).populate('team', 'id name email');
            return res.status(200).json(project.team);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error getting project team' });
        }
    }


    static async findMemberByEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email }).select('_id name email');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error finding user' });
        }
    }


    static async addMemberById(req: Request, res: Response) {
        try {
            const { id } = req.body;
            const user = await User.findById(id).select('_id');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // En el req viene el objeto del proyecto por el middleware validateProjectExists
            const { project } = req;

            // Verificar si el usuario es el manager del proyecto
            if (project.manager.toString() === user._id.toString()) {
                return res.status(403).json({ message: 'You cannot add yourself to the project' });
            }

            // Verificar si el usuario ya es miembro del proyecto
            if (project.team.includes(user._id)) {
                return res.status(400).json({ message: 'User is already a member of the project' });
            }

            // Agregar el usuario al proyecto
            project.team.push(user._id);
            await project.save();

            return res.status(200).json({ message: 'User added to project successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error adding user' });
        }
    }


    static async removeMemberById(req: Request, res: Response) {

        try {

            const { userId } = req.params;

            const user = await User.findById(userId).select('_id');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const { project } = req;

            if (!project.team.includes(user._id)) {
                return res.status(400).json({ message: 'User is not a member of the project' });
            }

            // Eliminar el usuario del proyecto
            project.team = project.team.filter(member => member.toString() !== user._id.toString());
            await project.save();

            return res.status(200).json({ message: 'User removed from project successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error removing uer' });
        }
    }

}   