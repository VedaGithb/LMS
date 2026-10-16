import { Link } from "react-router-dom";
import { MyCourseCard } from "../features/courses/components/MyCourseCard";
import { useMyEnroll } from "../features/enrollments/hooks/useMyEnroll"
import { AlertCircle, ArrowRight, Compass, Loader2 } from "lucide-react";

export const MyLearningPage = () => {
    const { data, isLoading, isError, refetch } = useMyEnroll();

    if (isLoading) return <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex items-center justify-center gap-2">
        <Loader2 className="animate-spin" size={24} />
        Загрузка ваших курсов...
    </div>

    if (isError) return <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex flex-col items-center justify-center gap-2">
        Не удалось загрузить данные обучения
        <button onClick={() => refetch()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">Попробовать снова <AlertCircle className="text-red-300" size={20} /></button>
    </div>

    if (!data) return <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex flex-col items-center justify-center gap-2">
        Не удалось загрузить данные обучения
        <button onClick={() => refetch()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">Попробовать снова <AlertCircle className="text-red-300" size={20} /></button>
    </div>



    return (
        <main className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 my-6 sm:my-8">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="uppercase text-indigo-600 text-xs font-semibold tracking-wider">
                            Личный кабинет студента
                        </span>
                    </div>
                    <div className="flex justify-between items-start mt-3 flex-col lg:flex-row gap-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">Мои курсы</h1>
                            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
                                Курсы, на которые вы записаны. Продолжайте обучение в удобном темпе.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto">
                            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80">
                                <p className="text-slate-500 text-xs sm:text-sm font-medium">Активных курсов</p>
                                <p className="text-slate-900 mt-1">
                                    <span className="font-bold text-xl sm:text-2xl mr-1">{data.stats.activeCourses}</span>
                                    <span className="text-xs sm:text-sm text-slate-500">из {data.courses.length}</span>
                                </p>
                            </div>
                            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80">
                                <p className="text-slate-500 text-xs sm:text-sm font-medium">Завершено уроков</p>
                                <p className="text-slate-900 mt-1">
                                    <span className="font-bold text-xl sm:text-2xl mr-1">{data.stats.completedLessons}</span>
                                    <span className="text-emerald-600 text-xs sm:text-sm font-medium">уроков</span>
                                </p>
                            </div>
                            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80">
                                <p className="text-slate-500 text-xs sm:text-sm font-medium">Средний прогресс</p>
                                <p className="font-bold text-xl sm:text-2xl text-indigo-600 mt-1">
                                    {data.stats.averageProgress}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    data.courses.length === 0
                        ? (
                            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col items-center mt-8">
                                <h4 className="text-xl font-semibold text-slate-800 text-center">Вы ещё не записались ни на одну программу обучения</h4>
                                <Link to="/courses" className="text-indigo-800 bg-indigo-100 px-4 py-2 rounded-xl inline-block hover:bg-indigo-200 transition-colors mt-4">Найти курсы</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                {data.courses.map((course) => (
                                    <MyCourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        )
                }

                <div className="bg-indigo-50 rounded-2xl p-5 sm:p-8 mt-10 sm:mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-indigo-100/80">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <Compass className="w-10 h-10 sm:w-11 sm:h-11 text-indigo-600 bg-white p-2 rounded-xl shrink-0 shadow-sm" />
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Ищете новые направления?</h3>
                            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
                                Хотите освоить новую технологию? Ознакомьтесь с новыми направлениями в общем каталоге.
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/courses"
                        className="w-full sm:w-auto justify-center bg-white hover:bg-slate-50 text-indigo-700 font-medium py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-sm transition-colors text-sm sm:text-base shrink-0"
                    >
                        Перейти в каталог <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    )
}