import type { Lesson, LessonDetails } from "../types";
import { api } from "../../../shared/api/axios";

export const getLessons = async (courseId: number): Promise<Lesson[]> => {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data;
}

export const getLessonById = async (lessonId: number): Promise<LessonDetails> => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
}

export const updateLessonProgress = async (lessonId: number, completed: boolean) => {
    const response = await api.patch(`/lessons/${lessonId}/progress`, { completed });
    return response.data;
} 