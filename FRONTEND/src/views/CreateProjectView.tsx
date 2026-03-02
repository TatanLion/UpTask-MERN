import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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

    const handleSubmitForm = async (formData : ProjectFormData) => {
        const data = await createProject(formData);
        toast.success(data.message);
        navigate("/");
    }

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
