import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useParams } from "react-router-dom";
// @NOTE Services
import { getTaskById } from "@/services/TaskAPI";
// @NOTE Components
import EditTaskModal from "./EditTaskModal";

export default function EditTaskData() {

  // @NOTE: Get the task id from the query params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editTaskId = queryParams.get("editTask")!;

  // @NOTE: Get the project id from the url params
  const params = useParams();
  const projectId = params.projectId!;  

  const { data, isError } = useQuery({
    queryKey: ["task", editTaskId],
    queryFn: () => getTaskById(projectId, editTaskId),
    enabled: !!editTaskId, // @NOTE: La consulta solo se ejecutará si editTaskId tiene un valor válido
    retry: false, // @NOTE: Se desactiva el reintento automático en caso de error, para manejar el error de forma personalizada
  })

  console.log(data);

  if (isError) return <Navigate to="/404" />;

  if (data) return <EditTaskModal task={data} taskId={editTaskId} />
}
