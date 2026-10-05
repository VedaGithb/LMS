import { useQuery } from "@tanstack/react-query";
import {getCourses, type GetCoursesParams} from "../api/course.api";

export const useCourses = (params: GetCoursesParams = { sort: "newest", limit: 50 }) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['courses', params],
        queryFn: () => getCourses(params),
    });

    return { data, isLoading, isError, error };
}