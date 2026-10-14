export type Theme = "dark" | "light";

export type TextSize = "standard" | "large";

export type CodeFontSize = "small" | "medium" | "large";

export interface Setting {
    theme: Theme;
    textSize: TextSize;
    autoNextLesson: boolean;
    rememberLessonPosition: boolean;
    codeFontSize: CodeFontSize;
}