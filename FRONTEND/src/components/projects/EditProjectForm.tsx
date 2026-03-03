import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
// @NOTE: Components
import ProjectForm from "./ProjectForm";
// @NOTE: Types
import type { Project, ProjectFormData } from "@/types/index";
// @NOTE: Services
import { updateProject } from "@/services/ProjectAPI";

type Props = {
    project: ProjectFormData;
    projectId: Project["_id"];
}

export default function EditProjectForm({ project, projectId }: Props) {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            projectName: project.projectName,
            clientName: project.clientName,
            description: project.description,
        }
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: (formData : ProjectFormData) => updateProject(projectId, formData),
        onSuccess: (data) => {
            // @NOTE: // Invalidar la caché de React Query para que se vuelva hacer a la API y se obtengan los datos actualizados.
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
            toast.success(data.message);
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleSubmitForm = (formData: ProjectFormData) => mutate(formData);

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el formulario para editar el proyecto</p>
                <nav className="my-5">
                    <Link
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to="/"
                    >
                        Volver a  Proyectos
                    </Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleSubmitForm)}
                    noValidate
                >
                    <ProjectForm
                        register={register}
                        errors={errors}
                    />

                    <input
                        type="submit"
                        value="Actualizar Proyecto"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold p-3 w-full uppercase cursor-pointer transition-colors"
                    />

                </form>
            </div>
        </>
    )
}
