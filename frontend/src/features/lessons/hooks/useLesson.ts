import { useQuery } from "@tanstack/react-query"
import { getLessonById } from "../api/lessons.api"

export const useLesson = (lessonId: string | undefined) => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: () => getLessonById(Number(lessonId)),
        enabled: !!lessonId
    })

    return { data, isLoading, isError, error, refetch };
}