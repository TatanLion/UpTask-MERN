import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// @NOTE: Components
import EditProjectForm from "@/components/projects/EditProjectForm";
// @NOTE: Services
import { getProjectById } from "@/services/ProjectAPI";

export default function EditProjectView() {

    const params = useParams();

    const projectId = params.projectId!;

    const { data, isLoading, isError } = useQuery({
        // @NOTE: Se le pasa un segundo valor al queryKey, que es el projectId, para que cada proyecto tenga un queryKey único y no haya conflictos en la caché de React Query
        queryKey: ["editProject", projectId],
        queryFn: () => getProjectById(projectId),
        retry: false, // @NOTE: Se desactiva el reintento automático en caso de error, para manejar el error de forma personalizada
    });

    // @NOTE: Loading
    if (isLoading) return <p>Cargando...</p>;

    // @NOTE: If there is an error
    if(isError)  return <Navigate to="/404" />

    // @NOTE: If there is data, render the form with the data
    if(data) return <EditProjectForm project={data} projectId={projectId} />;
}
