import {getMyEnrollments} from "../api/enrollment.api";
import {useQuery} from "@tanstack/react-query";
import {useAuth} from "../../auth/hooks/useAuth";

export const useMyEnroll = () => {
    const { isAuthenticated } = useAuth()
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['myEnroll'],
        queryFn: getMyEnrollments,
        enabled: isAuthenticated,
    });
    return {data, isLoading, isError, error};
}