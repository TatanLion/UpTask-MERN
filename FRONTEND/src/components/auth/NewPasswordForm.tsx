import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useMutation } from "@tanstack/react-query";
// @NOTE: Types
import type { ConfirmTokenForm, NewPasswordForm } from "../../types";
// @NOTE: Services
import { updatePasswordWithToken } from "@/services/AuthAPI";
// @NOTE: Components
import ErrorMessage from "../ErrorMessage";

interface NewPasswordFormProps {
    token: ConfirmTokenForm["token"];
}

export default function NewPasswordForm({ token }: NewPasswordFormProps) {

    const navigate = useNavigate()

    const initialValues: NewPasswordForm = {
        password: '',
        password2: '',
    }

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: updatePasswordWithToken,
        onSuccess: (data) => {
            console.log(data);
            toast.success(data.message);
            reset();
            navigate('/auth/login');
        },
        onError: (data) => {
            toast.error(data.message);
        }
    });

    const handleNewPassword = (formData: NewPasswordForm) => mutate({ formData, token });

    // eslint-disable-next-line react-hooks/incompatible-library
    const password = watch('password');

    return (
        <>
            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-8 p-10  bg-white mt-10"
                noValidate
            >

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Password</label>

                    <input
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "El Password es obligatorio",
                            minLength: {
                                value: 6,
                                message: 'El Password debe ser mínimo de 6 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Repetir Password</label>

                    <input
                        id="password2"
                        type="password"
                        placeholder="Repite Password de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password2", {
                            required: "Repetir Password es obligatorio",
                            validate: value => value === password || 'Los Passwords no son iguales'
                        })}
                    />

                    {errors.password2 && (
                        <ErrorMessage>{errors.password2.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Establecer Password'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>
        </>
    )
}