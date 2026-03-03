import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
// @NOTE Components
import ProjectForm from "@/components/projects/ProjectForm";
// @NOTE Types
import type { ProjectFormData } from "@/types/index";
// @NOTE Services
import { createProject } from "@/services/ProjectAPI";
import { toast } from "react-toastify";

export default function CreateProjectView() {

    const navigate = useNavigate();

    const initialValues : ProjectFormData = {
        projectName: "",
        clientName: "",
        description: "",
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialValues
    });

    const { mutate } = useMutation({
        // @NOTE: Función que se ejecutará para crear el proyecto
        mutationFn: createProject,
        // @NOTE: Manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito y redirigir al usuario a la lista de proyectos
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/");
        },
        // @NOTE: Manejar errores, por ejemplo, mostrar un mensaje de error
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleSubmitForm = (formData : ProjectFormData) => mutate(formData); // Llamar a la función de mutación para crear el proyecto con los datos del formulario

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Crear Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el formulario para crear un nuevo proyecto</p>
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
                        value="Crear Proyecto"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold p-3 w-full uppercase cursor-pointer transition-colors"
                    />

                </form>
            </div>
        </>
    )
}
