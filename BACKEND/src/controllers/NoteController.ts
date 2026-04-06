import { Request, Response } from "express";
import Note, { INote } from "../models/Note";


export class NoteController {

    static createNote = async (req: Request, res: Response) => {
        try {
            const note = new Note(req.body);
            note.createdBy = req.user._id;
            note.task = req.task._id;
            req.task.notes.push(note._id);
            await Promise.allSettled([
                note.save(),
                req.task.save()
            ]);
            res.status(201).json({
                message: 'Note created successfully',
                note
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error creating note' });
        }
    }

    static getTasksNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task._id });
            res.status(200).json(notes);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error getting notes' });
        }
    }

    static deleteNote = async (req: Request, res: Response) => {
        try {
            const { noteId } = req.params;
            const note = await Note.findById(noteId).populate({
                path: 'createdBy',
                select: '_id name email'
            });

            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }

            if (note.createdBy._id.toString() !== req.user._id.toString()) {
                console.log('Action not authorized, Its trying to delete a note that is not its own');
                return res.status(403).json({
                    message: 'Action not authorized'
                });
            }

            req.task.notes = req.task.notes.filter(note => note._id.toString() !== noteId.toString());

            await Promise.allSettled([
                req.task.save(),
                note.deleteOne()
            ]);

            res.status(200).json({ message: 'Note deleted successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error deleting note' });
        }
    }

}