import type {LessonWithProgress} from "../lessons/types.ts";

export interface CourseProgress {
    completedLessons: number;
    totalLessons: number;
    progressPercent: number;
    nextLessonId: number | null;
    lessons: LessonWithProgress[];
}