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
            <div className="max-w-[1700px] mx-auto px-6 my-8">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="uppercase text-indigo-500">личный кабинет студента</span>
                    </div>
                    <div className="flex justify-between mt-2 flex-col md:flex-row">
                        <div>
                            <h1 className="text-4xl font-bold mb-1">Мои курсы</h1>
                            <p className="text-slate-600">Курсы, на которые вы записаны. Продолжайте обучение в удобном темпе.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <p>Активных курсов</p>
                                <p><span className="font-bold text-xl mr-1">{data.stats.activeCourses}</span> из {data.courses.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <p>Завершено уроков</p>
                                <p><span className="font-bold text-xl mr-1">{data.stats.completedLessons}</span> <span className="text-emerald-700">уроков</span></p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <p>Средний прогресс</p>
                                <p className="font-bold text-xl mr-1 text-indigo-500">{data.stats.averageProgress}%</p>
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

                <div className="bg-indigo-50 rounded-lg p-8 mt-12 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Compass className="w-11 h-11 text-indigo-600 bg-white p-2 rounded-lg" />
                        <div>
                            <h3 className="text-xl font-semibold">Ищете новые направления?</h3>
                            <p className="text-slate-700">Хотите освоить новую технологию? Ознакомьтесь с новыми направлениями в общем каталоге.</p>
                        </div>
                    </div>
                    <Link to="/courses" className="bg-white py-2 px-6 rounded-lg flex items-center gap-2 w-fit">Перейти в каталог <ArrowRight className="w-4 h-4" /></Link>
                </div>
            </div>
        </main>
    )
}