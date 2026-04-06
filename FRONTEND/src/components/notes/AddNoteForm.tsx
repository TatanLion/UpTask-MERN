import { useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// @NOTE: Types
import type { NoteFormData } from "@/types/index";
// @NOTE: Components
import ErrorMessage from "../ErrorMessage";
// @NOTE: Services
import { createNote } from "@/services/NoteAPI";


export default function AddNoteForm() {

    // @NOTE: Get the project id and task id from the URL params and query params
    const params = useParams();
    const projectId = params.projectId!;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const taskId = searchParams.get("taskDetails")!;
    
    const queryClient = useQueryClient();
    

    const initialValues: NoteFormData = {
        content: "",
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm(
        { defaultValues: initialValues }
    );

    const { mutate } = useMutation({
        mutationFn: createNote,
        onSuccess: (data) => {
            toast.success(data.message, { toastId: "createNoteSuccess" });
            reset();
            queryClient.invalidateQueries({ queryKey: ["task", taskId] });
        },
        onError: (data) => {
            toast.error(data.message, { toastId: "createNoteError" });
        }
    });

    const handleAddNote = (formData: NoteFormData) => mutate({ projectId, taskId, formData });

    return (
        <form
            className='space-y-3'
            onSubmit={handleSubmit(handleAddNote)}
            noValidate
        >
            <div className='flex flex-col gap-2'>
                <label className="font-bold" htmlFor="content">Nota</label>
                <input
                    type="text"
                    id="content"
                    placeholder="Contenido de la nota"
                    className="w-full p-3 border border-gray-300"
                    {...register("content", {
                        required: "El contenido de la nota es obligatorio",
                        minLength: {
                            value: 5,
                            message: "El contenido de la nota debe tener al menos 5 caracteres"
                        }
                    })}
                />
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
            </div>

            <input
                type="submit"
                value="Crear Nota"
                className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
            />
        </form>
    )
}
