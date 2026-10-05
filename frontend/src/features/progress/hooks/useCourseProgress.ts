import { useQuery } from "@tanstack/react-query";
import { getCourseProgress } from "../api/progress.api";
import {useAuth} from "../../auth/hooks/useAuth";

export const useCourseProgress = (id: string | undefined, isEnrolled: boolean) => {
    const { isAuthenticated } = useAuth()
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["courseProgress", id],
        queryFn: () => getCourseProgress(Number(id)),
        enabled: !!id && isAuthenticated && isEnrolled,
    })



    return { data, isLoading, isError, error };
}

