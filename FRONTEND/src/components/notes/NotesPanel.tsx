// @NOTE: Components
import type { Note } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

interface NotesPanelProps {
    notes: Note[];
}

export default function NotesPanel({ notes }: NotesPanelProps) {
    return (
        <>
            <AddNoteForm />
            <div className="divide-y divide-gray-100 mt-5">
                {notes.length === 0 ? (
                    <p className="text-center text-gray-500">No hay notas para esta tarea</p>
                ) : (
                    <>
                        <p className="font-bold text-2xl text-slate-600 my-5">Notas:</p>
                        {notes.map(note => (
                            <NoteDetail key={note._id} note={note} />
                        ))}
                    </>
                )}
            </div>
        </>
    )
}
