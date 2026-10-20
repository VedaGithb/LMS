import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "../api/course.api";

export const useCourse = (id: string | undefined) => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['course', id],
        queryFn: () => getCourseById(Number(id)),
        enabled: !!id
    });

    return { data, isLoading, isError, error, refetch };
}