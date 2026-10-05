import { api } from "../../../shared/api/axios"
import type {Course, CourseDetails} from "../types";

export interface GetCoursesParams {
    sort: string;
    limit: number;
}

export const getCourses = async (params: GetCoursesParams): Promise<Course[]> => {
    const response = await api.get(`/courses`, {params});
    return response.data;
}

export const getCourseById = async (id: number): Promise<CourseDetails> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
}