import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// @NOTE Types
import type { TeamMemberFormData, Project } from "@/types/index";
// @NOTE Components
import ErrorMessage from "../ErrorMessage";
import SearchResult from "./SearchResult";
// @NOTE Services
import { findUserByEmail } from "@/services/TeamAPI";


// Type for the mutation function parameters
type findUserByEmailProps = {
    projectId: Project['_id'],
    email: TeamMemberFormData["email"]
} 

export default function AddMemberForm() {

    const initialValues: TeamMemberFormData = {
        email: ''
    }

    const params = useParams()
    const projectId = params.projectId!

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const mutation = useMutation({
        mutationFn: ({ projectId, email }: findUserByEmailProps) => findUserByEmail(projectId, email),
    })

    const handleSearchUser = async (formData : TeamMemberFormData) => {
        // mutation.mutate({ projectId, email: formData.email });
        const data = { projectId, email: formData.email }
        mutation.mutate(data);
    };

    const resetFormAndMutation = () => {
        reset();
        mutation.reset();
    }

    return (
        <>
            <form
                className="mt-10 space-y-5"
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate
            >

                <div className="flex flex-col gap-3">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="name"
                    >E-mail de Usuario</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="E-mail del usuario a Agregar"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "El Email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value='Buscar Usuario'
                />
            </form>

            <div className="mt-10">
                {mutation.isPending && <p className="text-center">Buscando usuario...</p>}
                {mutation.isError && <p className="text-center">Usuario no encontrado</p>}
                {mutation.isSuccess && <SearchResult user={mutation.data} reset={resetFormAndMutation} />}
            </div>
        </>
    )
}