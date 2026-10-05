import { api } from "../../../shared/api/axios";
import type {CourseProgress} from "../types";

export const getCourseProgress = async (courseId: number): Promise<CourseProgress> => {
    const response = await api.get(`/courses/${courseId}/progress`);
    return response.data;
}