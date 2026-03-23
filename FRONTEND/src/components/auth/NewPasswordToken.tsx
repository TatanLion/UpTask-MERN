import { Link } from 'react-router-dom';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import type { ConfirmTokenForm } from '@/types/index';
import { useMutation } from '@tanstack/react-query';
import { checkToken } from '@/services/AuthAPI';
import { toast } from 'react-toastify';


interface NewPasswordTokenProps {
    token: ConfirmTokenForm["token"];
    setToken: React.Dispatch<React.SetStateAction<ConfirmTokenForm["token"]>>;
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function NewPasswordToken({ token, setToken, setIsValidToken }: NewPasswordTokenProps) {

    const handleChange = (token: ConfirmTokenForm["token"]) => setToken(token);

    const { mutate } = useMutation({
        mutationFn: checkToken,
        onSuccess: (data) => {
            toast.success(data.message);
            setIsValidToken(true);
        },
        onError: (data) => {
            toast.error(data.message);
        }
    });

    const handleComplete = (token: ConfirmTokenForm["token"]) => mutate({ token });

    return (
        <>
            <form
                className="space-y-8 p-10 rounded-lg bg-white mt-10"
            >
                <label
                    className="font-normal text-2xl text-center block"
                >Código de 6 dígitos</label>
                <div className="flex justify-center gap-5">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                    </PinInput>
                </div>
            </form>
            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to='/auth/forgot-password'
                    className="text-center text-gray-300 font-normal"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>
        </>
    )
}