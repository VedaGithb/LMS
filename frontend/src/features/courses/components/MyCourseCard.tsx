import { ArrowRight, Circle, CircleCheck, Pause } from "lucide-react";
import type { EnrolledCourse } from "../../enrollments/types";
import { Link } from "react-router-dom";

export interface MyCourseCardProps {
    course: EnrolledCourse;
}

export const MyCourseCard = ({ course }: MyCourseCardProps) => {

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all h-full flex flex-col justify-between">
            <div className="flex justify-between">
                {course.completedLessons === course.lessonsCount && course.lessonsCount > 0
                    ? <p className="flex items-center gap-2 bg-slate-200 px-3 py-0.5 rounded-2xl w-fit text-emerald-600 text-sm"><span className="w-2 h-2 rounded-full bg-emerald-600"></span>Завершен</p>
                    : course.progressPercent > 0
                        ? <p className="flex items-center gap-2 bg-slate-200 px-3 py-0.5 rounded-2xl w-fit text-indigo-600 text-sm"><span className="w-2 h-2 rounded-full bg-indigo-600"></span>В процессе</p>
                        : <p className="flex items-center gap-2 bg-slate-200 px-3 py-0.5 rounded-2xl w-fit text-slate-600 text-sm"><span className="w-2 h-2 rounded-full bg-slate-600"></span>Не начат</p>
                }
                <p className="bg-slate-200 rounded-lg py-1 px-3 text-sm">{course.progressPercent}%</p>
            </div>
            <div className="px-1 py-5">
                <p className="text-slate-600 uppercase">{course.category}</p>
                <h2 className="text-xl font-bold my-1">{course.title}</h2>
                <p className="text-slate-600 line-clamp-2">{course.description}</p>
            </div>
            <div className="pt-4 pb-0">
                <div className="flex justify-between mb-2">
                    <p className="text-sm text-slate-600">Прогресс курса</p>
                    <p className="text-sm text-slate-600">{course.completedLessons} из {course.lessonsCount} уроков</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${course.progressPercent}%` }} />
                </div>
            </div>
            <div className={`p-4 mt-4 rounded-lg ${course.completedLessons === course.lessonsCount ? 'bg-emerald-50' : 'bg-indigo-50'}`}>
                {course.completedLessons === course.lessonsCount
                    ? <div className="flex items-center gap-4">
                        <CircleCheck className="w-6 h-6 text-emerald-900" />
                        <p>Все уроки пройдены! Курс успешно завершён</p>
                    </div>
                    : course.progressPercent > 0 && course.completedLessons !== course.lessonsCount
                        ? (
                            <div className="flex items-center gap-4">
                                <Pause className="w-6 h-6 text-indigo-900" />
                                <div>
                                    <p className="text-sm text-slate-600">Текущий урок:</p>
                                    <p>{course.currentLesson?.title}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Circle className="w-6 h-6 text-indigo-900" />
                                <div>
                                    <p className="text-sm text-slate-600">Первый урок:</p>
                                    <p>{course.currentLesson?.title}</p>
                                </div>
                            </div>
                        )
                }
            </div>
            {
                course.completedLessons !== course.lessonsCount
                    ? <Link to={course.currentLesson ? `/lessons/${course.currentLesson.id}` : `/courses/${course.id}`} className="flex justify-center items-center gap-2 w-full rounded-md px-4 py-2 bg-indigo-700 text-white hover:bg-indigo-800 mt-4">
                        Продолжить обучение <ArrowRight className="w-5 h-5" />
                    </Link>
                    : <Link to={`/courses/${course.id}`} className="block w-full rounded-md px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-800 mt-4 text-center">
                        К материалам курса
                    </Link>
            }
        </div>
    )
}