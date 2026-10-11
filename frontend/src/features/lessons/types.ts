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

export interface LessonModule {
    id: number;
    title: string;
    position: number;
}

export interface LessonCourse {
    id: number;
    title: string
}

export interface PrevNextLesson {
    id: number;
    title: string;
}

export type HeadingBlock = {
    type: "heading";
    text: string;
    level?: number;
}

export type ParagraphBlock = {
    type: "paragraph";
    text: string;
}

export type CodeBlock = {
    type: "code";
    code: string;
    language?: string;
    filename?: string;
}

export type ContentBlock = HeadingBlock | ParagraphBlock | CodeBlock;

export type LessonContent = {
    blocks: ContentBlock[];
}

export interface LessonDetails extends LessonWithProgress {
    module: LessonModule;
    course: LessonCourse;
    previous: PrevNextLesson | null;
    next: PrevNextLesson | null;
    content: LessonContent
}

