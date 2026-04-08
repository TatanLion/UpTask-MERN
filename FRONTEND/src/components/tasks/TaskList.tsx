import { DndContext, type DragEndEvent } from "@dnd-kit/core";
// @NOTE: Types
import type { Project, Task } from "@/types/index";
// @NOTE: Components
import TaskCard from "./TaskCard";
import DropTask from "./DropTask";
// @NOTE: Variables Locales
import { taskStatusLabels } from "@/locales/es";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/services/TaskAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

interface TaskListProps {
    tasks: Task[];
    hasAuthorization: boolean;
}

type GroupedTasks = {
    [key: string]: Task[];
}

type UpdateTaskStatusVariables = {
    status: Task['status'];
    projectId: Project["_id"];
    taskId: Task['_id'];
}

// @NOTE: Se define un tipo para agrupar las tareas ya que reduce no infiere el tipo de las propiedades del objeto resultante, por lo que se define un tipo explícito para evitar errores de tipado.
const initialGroupedTasks: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
}

const taskStatusStyles: { [key: string]: string } = {
    pending: "border-yellow-400",
    onHold: "border-red-400",
    inProgress: "border-blue-400",
    underReview: "border-purple-400",
    completed: "border-green-400",
}

export default function TaskList({ tasks, hasAuthorization }: TaskListProps) {

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialGroupedTasks);

    // Obtenemos el projectId del URL
    const params = useParams();
    const projectId = params.projectId!;

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: (variables: UpdateTaskStatusVariables) => updateTaskStatus(variables.status, variables.projectId, variables.taskId),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        },
        onError: (data) => {
            toast.error(data.message, { toastId: "updateTaskStatusErrorDragDrop" });
        }
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && over.id) {
            const taskId = active.id.toString();
            const status = over.id as Task['status'];
            mutate({ status, projectId, taskId });
        }
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext onDragEnd={handleDragEnd} >
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3
                                className={`capitalize text-xl font-light bg-white p-3 border-t-8 ${taskStatusStyles[status]}`}
                            >
                                {taskStatusLabels[status]}
                            </h3>
                            <DropTask status={status} />
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task =>
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            hasAuthorization={hasAuthorization}
                                        />
                                    )
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    )
}
