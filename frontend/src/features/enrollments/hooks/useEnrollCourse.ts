import {useMutation, useQueryClient} from "@tanstack/react-query";
import {enrollCourse} from "../api/enrollment.api";

export const useEnrollCourse = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (courseId: number) => enrollCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['myEnroll'],
            })
        }
    })
    return mutation;
}