import { addUserToProject } from "@/services/TeamAPI";
import type { Project, TeamMember } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface SearchResultProps {
    user: TeamMember;
    reset: () => void;
}

type addUserToProjectProps = {
    projectId: Project['_id'];
    id: TeamMember['_id'];
}

export default function SearchResult({ user, reset }: SearchResultProps) {

    const navigate = useNavigate();

    const params = useParams();
    const projectId = params.projectId!;

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: ({ projectId, id }: addUserToProjectProps) => addUserToProject( projectId, id ),
        onSuccess: (data) => {
            toast.success(data.message);
            reset();
            queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] });
            navigate(`/projects/${projectId}/team`, { replace: true });
        },
        onError: (data) => {
            toast.error(data.message);
        }
    });
        

    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado de la búsqueda:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
                    onClick={() => mutate({ projectId, id: user._id })}
                >
                    Agregar al Proyecto
                </button>
            </div>
        </>
    )
}
