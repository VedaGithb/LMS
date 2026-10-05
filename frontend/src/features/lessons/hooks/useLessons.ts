import { useQuery } from "@tanstack/react-query";
import { getLessons } from "../api/lessons.api";

export const useLessons = (courseId: string | undefined) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['lessons', courseId],
        queryFn: () => getLessons(Number(courseId)),
        enabled: !!courseId
    });

    return { data, isLoading, isError, error };
}