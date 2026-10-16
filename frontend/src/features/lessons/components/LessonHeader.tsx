import { ArrowLeft } from "lucide-react"
import type { LessonDetails } from "../types"
import type { CourseProgress } from "../../progress/types";
import { Link } from "react-router-dom";

type LessonHeaderProps = {
    data: LessonDetails;
    progress?: CourseProgress;
}

export const LessonHeader = ({ data, progress }: LessonHeaderProps) => {
    return (
        <section className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center text-xs sm:text-sm gap-y-1">
                <ArrowLeft className="w-4 h-4 mr-1.5 shrink-0 text-slate-500" />
                <Link to={`/courses/${data.course.id}`} className="text-slate-600 mr-1 hover:underline">
                    Курс {data.course.title}
                </Link>
                <span className="text-slate-400 mr-1">/</span>
                <span className="text-slate-600 mr-1">{data.module.title}</span>
                <span className="text-slate-400 mr-1">/</span>
                <p className="text-slate-800 font-bold">Урок {data.position}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {data.completed ? (
                    <div className="flex items-center gap-1.5 bg-green-100 px-2.5 py-1 rounded-lg">
                        <span className="bg-green-600 w-2 h-2 rounded-full animate-pulse"></span>
                        <p className="text-green-700 text-xs sm:text-sm font-medium">Завершен</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 bg-indigo-100 px-2.5 py-1 rounded-lg">
                        <span className="bg-indigo-600 w-2 h-2 rounded-full animate-pulse"></span>
                        <p className="text-indigo-700 text-xs sm:text-sm font-medium">В процессе изучения</p>
                    </div>
                )}
                {progress && (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-slate-600 text-xs sm:text-sm whitespace-nowrap">
                            Прогресс: {progress.completedLessons} из {progress.totalLessons}
                        </span>
                        <div className="w-20 sm:w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress.progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};