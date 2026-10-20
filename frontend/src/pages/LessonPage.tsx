import { Link, useNavigate, useParams } from "react-router-dom";
import { useLesson } from "../features/lessons/hooks/useLesson";
import { useCourseProgress } from "../features/progress/hooks/useCourseProgress";
import { LessonContent } from "../features/lessons/components/LessonContent";
import { LessonHeader } from "../features/lessons/components/LessonHeader";
import { ArrowLeft, ArrowRight, CircleCheck, CircleCheckBig, Clock, Loader2, AlertCircle } from "lucide-react";
import { useCourse } from "../features/courses/hooks/useCourse";
import { useUpdateLessonProgress } from "../features/lessons/hooks/useUpdateLessonProgress";
import { useSettings } from "../features/settings/hooks/useSettings";
import { useEffect } from "react";

export const LessonPage = () => {
    const { id } = useParams();
    const { data, isLoading, isError, refetch } = useLesson(id);
    const { data: course, isLoading: courseLoading } = useCourse(data?.course.id ? String(data.course.id) : undefined);
    const { setting } = useSettings();
    const navigate = useNavigate();
    const { data: progress } = useCourseProgress(data?.course.id ? String(data.course.id) : undefined, true);
    const mutation = useUpdateLessonProgress();

    useEffect(() => {
        const storageKey = `lesson_scroll_${id}`;
        const savedPosition = localStorage.getItem(storageKey);

        if (setting.rememberLessonPosition && savedPosition && data) {
            window.scrollTo({
                top: Number(savedPosition),
                behavior: "smooth",
            });
        }

    }, [id, data, setting.rememberLessonPosition])

    useEffect(() => {
        if (!setting.rememberLessonPosition || !id) return;

        let timeoutId: number | undefined;


        const storageKey = `lesson_scroll_${id}`;

        const handleScroll = () => {
            if (typeof (timeoutId) === "number") clearTimeout(timeoutId);
            timeoutId = setTimeout(() => localStorage.setItem(storageKey, String(window.scrollY)), 200);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll)
            clearTimeout(timeoutId)
        };
    }, [id, setting.rememberLessonPosition])

    if (isLoading) {
        return (
            <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex items-center justify-center gap-2">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
                <span className="text-slate-600 font-medium">Загрузка урока...</span>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex flex-col items-center justify-center gap-3">
                <p className="text-slate-700 font-medium">Не удалось загрузить урок</p>
                <button
                    onClick={() => refetch()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                >
                    Попробовать снова <AlertCircle className="text-red-300" size={18} />
                </button>
            </div>
        );
    }

    const displayBlocks = data.content.blocks.filter((block, index) => {
        return !(block.type === "heading" && data.title === block.text && index === 0);
    });

    const toggleProgress = () => {
        const isAutoNavigate = !data.completed && setting.autoNextLesson && data.next;
        mutation.mutate({ lessonId: data.id, completed: !data.completed }, {
            onSuccess: () => {
                if (isAutoNavigate && data.next) {
                    navigate(`/lessons/${data.next.id}`);
                }
            }
        }
        )
    }

    const completedLessonsIds = new Set(progress?.lessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id) ?? []);

    return (
        <main className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 my-6 sm:my-8">
                <LessonHeader data={data} progress={progress} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start my-8 sm:my-12">
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 md:p-10 mb-8 sm:mb-10">
                            <div className="flex flex-wrap gap-3 sm:gap-6 items-center mb-6 sm:mb-10">
                                <p className="bg-indigo-100 text-indigo-700 font-medium w-fit py-1 px-2.5 text-xs sm:text-sm rounded-lg">
                                    {data.module.title}
                                </p>
                                <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {data.durationMinutes} мин чтения
                                </p>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
                                {data.title}
                            </h1>
                            <LessonContent content={{ ...data.content, blocks: displayBlocks }} />
                        </div>

                        {/* Responsive bottom navigation */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl shadow-sm sm:shadow-none border border-slate-200/80 sm:border-0">
                            {data.previous ? (
                                <Link
                                    to={`/lessons/${data.previous.id}`}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium order-2 sm:order-1"
                                >
                                    <ArrowLeft className="w-4 h-4 shrink-0" />
                                    <span className="truncate max-w-[200px]">Предыдущий: {data.previous.title}</span>
                                </Link>
                            ) : (
                                <div className="hidden sm:block order-1"></div>
                            )}

                            <div className="order-1 sm:order-2">
                                {data.completed ? (
                                    <button
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 font-medium text-sm transition-colors shadow-sm"
                                        onClick={toggleProgress}
                                        disabled={mutation.isPending}
                                    >
                                        <CircleCheckBig className="w-4 h-4 shrink-0" /> Урок пройден (отменить)
                                    </button>
                                ) : (
                                    <button
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm"
                                        onClick={toggleProgress}
                                        disabled={mutation.isPending}
                                    >
                                        <CircleCheckBig className="w-4 h-4 shrink-0" /> Отметить урок как пройденный
                                    </button>
                                )}
                            </div>

                            {data.next ? (
                                <Link
                                    to={`/lessons/${data.next.id}`}
                                    className="flex items-center justify-end gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium order-3"
                                >
                                    <span className="truncate max-w-[200px]">Следующий: {data.next.title}</span>
                                    <ArrowRight className="w-4 h-4 shrink-0" />
                                </Link>
                            ) : (
                                <div className="hidden sm:block order-3"></div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
                            <h4 className="font-bold text-base sm:text-lg text-slate-900 mb-2">Содержание курса</h4>
                            <div>
                                {courseLoading || !course ? (
                                    <div className="flex items-center gap-2 py-4 text-slate-500 text-sm">
                                        <Loader2 className="animate-spin text-indigo-600 w-4 h-4" />
                                        <span>Загрузка содержания...</span>
                                    </div>
                                ) : (
                                    course.modules.map((module) => (
                                        <div key={module.id} className="mb-4 border-b border-slate-300 last:border-0 pb-2">
                                            <p className="font-semibold text-xs text-slate-600 uppercase mt-2">{module.title}</p>
                                            {module.lessons.map((lesson) => (
                                                <Link
                                                    key={lesson.id}
                                                    to={`/lessons/${lesson.id}`}
                                                    className={`block text-sm ${lesson.id === data.id ? 'font-bold bg-indigo-100 text-indigo-700 p-2 my-1 rounded-lg' : 'text-slate-600 hover:text-slate-900'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {completedLessonsIds.has(lesson.id) ? <CircleCheck className="w-6 h-6 text-emerald-600" /> : <div className="w-4" />}{lesson.title}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}