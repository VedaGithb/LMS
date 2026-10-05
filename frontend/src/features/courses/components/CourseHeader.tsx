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
        <div className="bg-white rounded-lg shadow-sm py-5 px-6">
            <div className="flex items-center gap-2 bg-slate-300 rounded-lg px-2 py-1 w-fit">
                <p className="text-slate-700 text-sm">{course.category}</p>
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                <p className="text-slate-700 text-sm">{course.lessonsCount} уроков</p>
            </div>
            <div className="mt-5">
                <h1 className="font-bold text-4xl mb-2">{course.title}</h1>
                <p className="text-slate-600 max-w-[800px] mb-6">{course.description}</p>
                {nextLesson !== undefined && <button onClick={onStartLearning}
                       className="flex items-center gap-2 bg-indigo-600 w-fit px-3 py-2 rounded-lg text-white"
                       disabled={isPending}>
                    {nextLesson.position === 1
                        ? "Начать обучение"
                        : "Продолжить обучение"
                    } (Урок {nextLesson.position}) <ArrowRight className="w-5 h-5"/>
                </button>
                }
            </div>
        </div>
    )
}