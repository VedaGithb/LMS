import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateLessonProgress } from "../api/lessons.api";

export const useUpdateLessonProgress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ lessonId, completed }: { lessonId: number, completed: boolean }) =>
            updateLessonProgress(lessonId, completed),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["lesson", String(variables.lessonId)],
            })
            queryClient.invalidateQueries({
                queryKey: ["courseProgress"]
            })
        }
    })
}