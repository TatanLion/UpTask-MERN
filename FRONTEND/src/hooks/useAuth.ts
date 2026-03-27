import { getUser } from "@/services/AuthAPI";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false, // @NOTE: No refetch al enfocar la ventana
    });

    return { data, isLoading, isError };
}