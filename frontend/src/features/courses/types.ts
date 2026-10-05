export interface Course {
    id: number;
    title: string;
    technologies: string[];
    lessonsCount: number;
    totalDuration: number;
    description: string;
    category: string;
    prerequisites: string[];
}

export interface LessonPreview {
    id: number;
    title: string;
    position: number;
    durationMinutes: number;
}

export interface Module {
    id: number;
    title: string;
    position: number;
    lessons: LessonPreview[];
}

export interface CourseDetails extends Course {
    modules: Module[];
}