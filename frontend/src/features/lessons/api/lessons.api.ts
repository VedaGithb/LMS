import type {Lesson} from "../types";
import {api} from "../../../shared/api/axios";

export const getLessons = async (courseId: number): Promise<Lesson[]> => {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data;
}