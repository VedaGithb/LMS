export type Lesson = {
    id: number;
    title: string;
    content: string;
    position: number;
    durationMinutes: number;
}

export interface LessonWithProgress extends Pick<Lesson, "id" | "title" | "position" | "durationMinutes"> {
    completed: boolean;
}