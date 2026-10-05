import { ArrowRight, Check, ChevronRight } from "lucide-react";
import type { LessonWithProgress } from "../types";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useState } from "react";

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
                <h3 className="text-lg font-bold">Программа курса ({lessons.length} уроков)</h3>
            </div>
            {showAuthWarning && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium">Для перехода к уроку необходимо войти в систему</p>
                    <Link to="/login" className="text-sm font-bold underline hover:text-amber-900">
                        Войти
                    </Link>
                </div>
            )}
            <div className="bg-white rounded-lg shadow-sm py-6 border-t border-slate-200 px-8">
                {lessons.map((lesson, index) => {
                    const isCompleted = lesson.completed;
                    const isCurrent = lesson.id === nextLessonId;

                    return (
                        <Link to={`/lessons/${lesson.id}`} onClick={handleLessonClick} key={lesson.id} className="flex items-center justify-between mb-4 hover:bg-slate-50 rounded-lg py-2.5 transition-colors px-3 cursor-pointer">
                            <div className="flex items-center gap-2">
                                {isCompleted
                                    ? <Check className="w-6 h-6 p-1 rounded-full bg-green-200 text-green-800" />
                                    : isCurrent
                                        ? <span className="w-4 h-4 rounded-full bg-indigo-600 animate-pulse mx-1"></span>
                                        : <span className="w-6 h-6 p-1 rounded-full bg-slate-200 text-center flex items-center justify-center">
                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                        </span>
                                }
                                <span className={`${isCurrent ? "text-indigo-600" : "text-slate-800"} font-bold text-lg mx-1`}>{index + 1}.</span>
                                <h4 className={`${isCurrent ? "text-indigo-600" : "text-slate-800"} text-lg font-bold `}>{lesson.title}</h4>
                            </div>
                            <div className="flex items-center gap-6">
                                {
                                    isCompleted
                                        ? (
                                            <span className="text-green-800 font-bold text-sm font-semibold mx-1 bg-green-200 p-1 rounded-lg ">Завершено</span>
                                        )
                                        : isCurrent
                                            ? (
                                                <span className="text-indigo-600 font-bold text-sm font-semibold mx-1 flex items-center">Текущий урок <ArrowRight className="w-6 h-6" /></span>
                                            )
                                            : (
                                                <span className="text-slate-600 text-sm font-semibold mx-1">Урок {index + 1}</span>
                                            )
                                }
                                <span className={isCurrent ? "font-bold text-sm text-indigo-600 font-semibold" : "text-slate-500 text-sm"}>{lesson.durationMinutes} мин</span>
                                <ChevronRight className={isCurrent ? "w-6 h-6 text-indigo-600" : "w-6 h-6 text-slate-500"} />
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}