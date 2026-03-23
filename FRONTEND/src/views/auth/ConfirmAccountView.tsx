import { useState } from "react";
import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
// @NOTE: Types
import { type ConfirmTokenForm } from "@/types/index";
// @NOTE: Services
import { confirmAccount } from "@/services/AuthAPI";


export default function ConfirmAccountView() {

    const [token, setToken] = useState<ConfirmTokenForm['token']>('');

    const handleChangeToken = (token: string) => setToken(token);

    const { mutate, reset } = useMutation({
        mutationFn: confirmAccount,
        onSuccess: (data) => {
            toast.success(data.message);
            reset();
        },
        onError: (data) => {
            toast.error(data.message);
        }
    });

    // @NOTE: Esta función se ejecuta cuando el usuario completa los 6 dígitos del código, y recibe el token completo como argumento
    const handleCompleteToken = (token: string) => mutate({ token });

    return (
        <>
            <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
            <p className="text-2xl font-light text-white mt-5">
                Ingresa el código que recibiste {''}
                <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
            </p>
            <form
                className="space-y-8 p-10 bg-white mt-10"
            >
                <label
                    className="font-normal text-2xl text-center block"
                >Código de 6 dígitos</label>
                <div className="flex justify-center gap-5">
                    <PinInput 
                        value={token} 
                        onChange={handleChangeToken}
                        onComplete={handleCompleteToken}
                    >
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                    </PinInput>
                </div>
            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to='/auth/request-code'
                    className="text-center text-gray-300 font-normal"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>

        </>
    )
}