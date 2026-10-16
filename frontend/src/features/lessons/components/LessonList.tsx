import { ArrowRight, Check, ChevronRight } from "lucide-react";
import type { LessonWithProgress } from "../types";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useState } from "react";
import { pluralize } from "../../../shared/utils/pluralize";

type LessonListProps = {
    lessons: LessonWithProgress[];
    nextLessonId?: number;
}

export const LessonList = ({ lessons, nextLessonId }: LessonListProps) => {
    const { isAuthenticated } = useAuth();
    const [showAuthWarning, setShowAuthWarning] = useState(false);

    const handleLessonClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setShowAuthWarning(true);
        }
    }
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Программа курса ({lessons.length} {pluralize(lessons.length, "курс", "курса", "курсов")})</h3>
            </div>
            {showAuthWarning && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium">Для перехода к уроку необходимо войти в систему</p>
                    <Link to="/login" className="text-sm font-bold underline hover:text-amber-900">
                        Войти
                    </Link>
                </div>
            )}
            <div className="bg-white rounded-2xl shadow-sm py-5 sm:py-6 border-t border-slate-200 px-3 sm:px-6 md:px-8">
                {lessons.map((lesson, index) => {
                    const isCompleted = lesson.completed;
                    const isCurrent = lesson.id === nextLessonId;

                    return (
                        <Link
                            to={`/lessons/${lesson.id}`}
                            onClick={handleLessonClick}
                            key={lesson.id}
                            className="flex items-center justify-between mb-3 hover:bg-slate-50 rounded-xl py-2.5 transition-colors px-2 sm:px-3 cursor-pointer gap-3"
                        >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                {isCompleted ? (
                                    <Check className="w-5 h-5 sm:w-6 sm:h-6 p-1 rounded-full bg-green-200 text-green-800 shrink-0" />
                                ) : isCurrent ? (
                                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-indigo-600 animate-pulse mx-1 shrink-0"></span>
                                ) : (
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 p-1 rounded-full bg-slate-200 text-center flex items-center justify-center shrink-0">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-400"></span>
                                    </span>
                                )}
                                <span className={`${isCurrent ? "text-indigo-600" : "text-slate-800"} font-bold text-sm sm:text-base shrink-0`}>
                                    {index + 1}.
                                </span>
                                <h4 className={`${isCurrent ? "text-indigo-600 font-bold" : "text-slate-800 font-semibold"} text-sm sm:text-base md:text-lg truncate`}>
                                    {lesson.title}
                                </h4>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
                                {isCompleted ? (
                                    <span className="text-green-800 font-bold text-xs sm:text-sm bg-green-100 px-2 py-0.5 rounded-md hidden xs:inline-block">
                                        Завершено
                                    </span>
                                ) : isCurrent ? (
                                    <span className="text-indigo-600 font-bold text-xs sm:text-sm hidden sm:inline-flex items-center gap-1">
                                        Текущий <ArrowRight className="w-4 h-4" />
                                    </span>
                                ) : (
                                    <span className="text-slate-500 text-xs sm:text-sm hidden md:inline-block">
                                        Урок {index + 1}
                                    </span>
                                )}
                                <span className={`text-xs sm:text-sm whitespace-nowrap ${isCurrent ? "font-bold text-indigo-600" : "text-slate-500"}`}>
                                    {lesson.durationMinutes} мин
                                </span>
                                <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isCurrent ? "text-indigo-600" : "text-slate-400"}`} />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};