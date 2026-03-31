import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { userSchema, type ConfirmTokenForm, 
        type NewPasswordForm, 
        type RequestNewConfirmationCodeForm, 
        type UserLoginForm, 
        type UserRegistrationForm 
} from "@/types/index";


export async function createAccount (formData: UserRegistrationForm) {
    try {
        const { data } = await api.post("/auth/create-account", formData);
        // console.log(data);
        return data;
    } catch (error) {
        // @NOTE: Como esto es ejecución de código en el cliente, es posible que el error sea un error de Axios, por lo que se verifica si es un error de Axios y si tiene una respuesta
        if(isAxiosError(error) && error.response) {
            // @NOTE: Este mensaje se envia desde el backend, por lo que se accede a error.response.data.message y se envia como mensaje de error al frontend
            throw new Error(error.response.data.message);
        }
    }
};


export async function confirmAccount (formData: ConfirmTokenForm) {
    try {
        const { data } = await api.post("/auth/confirm-account", formData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function requestNewConfirmationCode (formData: RequestNewConfirmationCodeForm) {
    try {
        const { data } = await api.post("/auth/request-code", formData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function login (formData: UserLoginForm) {
    try {
        const { data } = await api.post("/auth/login", formData);
        localStorage.setItem("AUTH_TOKEN", data.token);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function forgotPassword (formData: { email: string }) {
    try {
        const { data } = await api.post("/auth/forgot-password", formData);
        console.log(data);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function checkToken (formData: ConfirmTokenForm) {
    try {
        const { data } = await api.post("/auth/check-token", formData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


// @NOTE: Las funciones de mutaciones siempre deben recibir un objeto con los datos necesarios para realizar la mutación, si no se recibe un objeto con los valores generara un error
export async function updatePasswordWithToken ({ formData, token }: { formData: NewPasswordForm, token: ConfirmTokenForm["token"] }) {
    try {
        const { data } = await api.post(`/auth/update-password/${token}`, formData);
        // console.log(data);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}


export async function getUser () {
    try {
        const { data } = await api.get("/auth/user");
        const response = userSchema.safeParse(data);
        if(!response.success) {
            throw new Error("Error al obtener el usuario");
        }
        return response.data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}