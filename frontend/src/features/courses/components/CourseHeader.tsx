import type {Course, LessonPreview} from "../types";
import {ArrowRight} from "lucide-react";

type CourseHeaderProps = {
    course: Course;
    nextLesson: LessonPreview | undefined;
    onStartLearning: () => void;
    isPending: boolean;
}

export const CourseHeader = ({course, nextLesson, onStartLearning, isPending}: CourseHeaderProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm py-5 px-4 sm:px-6">
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-2.5 py-1 w-fit">
                <p className="text-slate-700 text-xs sm:text-sm">{course.category}</p>
                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                <p className="text-slate-700 text-xs sm:text-sm">{course.lessonsCount} уроков</p>
            </div>
            <div className="mt-4 sm:mt-5">
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-2">{course.title}</h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-[800px] mb-6 leading-relaxed">{course.description}</p>
                {nextLesson !== undefined && (
                    <button
                        onClick={onStartLearning}
                        className="flex items-center justify-center gap-2 bg-indigo-600 w-full sm:w-fit px-5 py-2.5 rounded-xl text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm text-sm sm:text-base"
                        disabled={isPending}
                    >
                        {nextLesson.position === 1 ? "Начать обучение" : "Продолжить обучение"} (Урок {nextLesson.position}){" "}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};