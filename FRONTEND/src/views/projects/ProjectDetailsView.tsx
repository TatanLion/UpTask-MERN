import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// @NOTE Services
import { getProjectById } from "@/services/ProjectAPI";
// @NOTE Components
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
// @NOTE: Hooks
import { useAuth } from "@/hooks/useAuth";
// @NOTE: Utils
import { isManager } from "@/utils/policies";
import { useMemo } from "react";

export default function ProjectDetailsView() {

    // @NOTE: Obtenemos los datos del usuario autenticado para saber si es manager o no.
    const { data: userData, isLoading: isUserLoading } = useAuth();

    const params = useParams();
    const projectId = params.projectId!;

    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId),
        retry: false, // @NOTE: Se desactiva el reintento automático en caso de error, para manejar el error de forma personalizada
    });

    console.log(data);
    

    const hasAutorization = useMemo(() => 
        isManager(data?.project.manager, userData?._id)
    , [data, userData]);

    // @NOTE: Loading
    if (isLoading && isUserLoading) return <p>Cargando...</p>;

    // @NOTE: If there is an error
    if (isError) return <Navigate to="/404" />

    // @NOTE: If there is data, render the form with the data
    if (data && userData) return (
        <div>
            <h1 className="text-5xl font-black">{data.project.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.project.description}</p>

            {isManager(data.project.manager, userData._id) && (
                <nav className="my-5 flex gap-3">
                    <button
                        type="button"
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        onClick={() => navigate(`${location.pathname}?newTask=true`)}
                    >
                        Agregar Tarea
                    </button>
                    <Link
                        to={`/projects/${projectId}/team`}
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    >
                        Colaboradores
                    </Link>
                </nav>
            )}


            <TaskList
                tasks={data.project.tasks}
                hasAuthorization={hasAutorization}
            />

            <AddTaskModal />

            <EditTaskData />

            <TaskModalDetails />

        </div>
    );
}