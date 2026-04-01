import { Fragment, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
// @NOTE: Services
import { getTaskById, updateTaskStatus } from '@/services/TaskAPI';
// @NOTE: Utils
import { formatDate } from '@/utils/utils';
// @NOTE: Locales/Constants
import { taskStatusLabels } from '@/locales/es';
// @NOTE: Types
import type { Task } from '@/types/index';


export default function TaskModalDetails() {

    const params = useParams();
    const projectId = params.projectId!;

    // @NOTE: Get the task id from the query params
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const taskDetailsId = searchParams.get("taskDetails");
    
    const isOpen = !!taskDetailsId;

    const navigate = useNavigate();

    const { data, isError, error } = useQuery({
        queryKey: ["task", taskDetailsId],
        queryFn: () => getTaskById(projectId, taskDetailsId!),
        enabled: !!taskDetailsId, // @NOTE: La consulta solo se ejecutará si taskDetailsId tiene un valor válido
        retry: false, // @NOTE: No reintentar en caso de error
    });


    const queryClient = useQueryClient();
    
    const { mutate } = useMutation({
        mutationFn: (status: Task['status']) => updateTaskStatus(status, projectId, taskDetailsId!),
        onSuccess: (data) => {
            toast.success(data.message, { toastId: "updateTaskStatusSuccess" });
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["task", taskDetailsId] });
            navigate(`${location.pathname}`, { replace: true });
        },
        onError: (data) => {
            toast.error(data.message, { toastId: "updateTaskStatusError" });
        }
    });

    // @NOTE: El toast se ejecuta en useEffect para evitar llamar setState de otro componente durante el render
    useEffect(() => {
        if (isError) {
            toast.error(error!.message, { toastId: "taskDetailsError" });
        }
    }, [isError, error]);

    if (isError) return <Navigate to={`/projects/${projectId}`} replace />;

    if (data) return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10"
                    onClose={() => navigate(`${location.pathname}`, { replace: true })}
                >
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <p className='text-sm text-slate-400'>Agregada el: {formatDate(data.createdAt!)}</p>
                                    <p className='text-sm text-slate-400'>Última actualización: {formatDate(data.updatedAt!)}</p>
                                    <DialogTitle
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data.name}
                                    </DialogTitle>
                                    <p className='text-lg text-slate-500 mb-2'>Descripción: {data.description}</p>
                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual:</label>
                                        <select 
                                            id="status"
                                            className='w-full p-3 bg-white border border-gray-300'
                                            defaultValue={data.status}
                                            onChange={(e) => mutate(e.target.value as Task['status'])}
                                        >
                                            {Object.entries(taskStatusLabels).map(([status, label]) => (
                                                <option 
                                                    key={status} 
                                                    value={status}                                               
                                                >
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}