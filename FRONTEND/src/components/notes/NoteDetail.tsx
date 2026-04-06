// @NOTE: Hooks
import { useAuth } from "@/hooks/useAuth";
// @NOTE: Types
import type { Note } from "@/types/index";
// @NOTE: Utils
import { formatDate } from "@/utils/utils";
import Loading from "../Loading";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/services/NoteAPI";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

interface NoteDetailProps {
    note: Note;
}

export default function NoteDetail({ note }: NoteDetailProps) {

    // @NOTE: Get the project id and task id from the URL params and query params
    const params = useParams();
    const projectId = params.projectId!;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const taskId = searchParams.get("taskDetails")!;

    const { data, isLoading } = useAuth();
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ["task", taskId] });
        },
        onError: (data) => {
            toast.error(data.message)
        }
    })

    const handleDeleteNote = () => mutate({ projectId, taskId, noteId: note._id });

    if (isLoading) return <Loading />;

    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    <span className="font-bold">{note.createdBy.name}: {' '}</span>
                    {note.content}
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(note.createdAt)}
                </p>
            </div>

            {/* Validar si el usuario autenticado es el creador de la nota para mostrar el botón de eliminar */}
            {canDelete && (
                <button
                    type="button"
                    className="bg-red-400 hover:bg-red-500 text-white p-2 text-xs font-bold cursor-pointer transition-colors"
                    onClick={handleDeleteNote}
                >
                    Eliminar
                </button>
            )}
        </div>
    )
}
