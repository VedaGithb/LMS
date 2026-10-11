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
        <section className="mb-4 flex justify-between">
            <div className="flex items-center">
                <ArrowLeft className="w-5 h-5 mx-2" />
                <Link to={`/courses/${data.course.id}`} className="text-slate-600 mr-1 hover:underline">Курс {data.course.title}</Link>
                <span className="text-slate-600 mr-1">/</span>
                <span className="text-slate-600 mr-1">{data.module.title}</span>
                <span className="text-slate-600 mr-1">/</span>
                <p className="text-slate-800 mr-1 font-bold">Урок {data.position}</p>
            </div>
            <div className="flex items-center gap-4">
                {data.completed ? (
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-0.5 rounded-lg">
                        <span className="bg-green-600 w-2 h-2 rounded-full animate-pulse"></span>
                        <p className="text-green-600">Завершен</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-indigo-100 px-3 py-0.5 rounded-lg">
                        <span className="bg-indigo-600 w-2 h-2 rounded-full animate-pulse"></span>
                        <p className="text-indigo-600">В процессе изучения</p>
                    </div>
                )}
                {progress && (
                    <div className="flex items-center gap-3">
                        <span className="text-slate-600 text-sm whitespace-nowrap">
                            Прогресс: {progress.completedLessons} из {progress.totalLessons}
                        </span>
                        <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress.progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}