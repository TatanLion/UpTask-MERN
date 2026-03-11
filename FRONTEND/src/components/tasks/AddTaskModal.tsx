import { Fragment } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// @NOTE: Componentes
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import TaskForm from './TaskForm';
// @NOTE: Types
import type { TaskFormData } from '@/types/index';
// @NOTE: Services
import { createTask } from '@/services/TaskAPI';


export default function AddTaskModal() {

    const navigate = useNavigate();    

    // @NOTE: Se obtiene el valor del query param "newTask" para determinar si el modal debe estar abierto o cerrado
    const location = useLocation();    
    const queryParams = new URLSearchParams(location.search);
    const modalTask = queryParams.get("newTask");
    const isOpen = modalTask === "true";

    // Obtener el projectId
    const params = useParams();
    const projectId = params.projectId!;

    const initialValues : TaskFormData = {
        name: "",
        description: "",
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
        defaultValues: initialValues
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: (data: TaskFormData) => createTask(data, projectId),
        onSuccess: (data) => {
            toast.success(data.message);
            navigate(location.pathname, { replace: true });
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            reset();
        },
        onError: (data) => {
            toast.error(data.message);
        }
    })

    const handleSubmitForm = (data: TaskFormData) => mutate(data);

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => navigate(location.pathname, { replace: true })}
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
                                    <DialogTitle
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Nueva Tarea
                                    </DialogTitle>

                                    <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600">una tarea</span>
                                    </p>

                                    <form
                                        className='mt-10 space-y-3'
                                        noValidate
                                        onSubmit={handleSubmit(handleSubmitForm)}
                                    >

                                        <TaskForm
                                            errors={errors}
                                            register={register}
                                        />

                                        <input
                                            type="submit"
                                            value="Guardar Tarea"
                                            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold p-3 w-full uppercase cursor-pointer transition-colors"
                                        />
                                    </form>

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}