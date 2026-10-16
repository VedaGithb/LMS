import { Link, useNavigate, useParams } from "react-router-dom";
import { useLesson } from "../features/lessons/hooks/useLesson";
import { useCourseProgress } from "../features/progress/hooks/useCourseProgress";
import { LessonContent } from "../features/lessons/components/LessonContent";
import { LessonHeader } from "../features/lessons/components/LessonHeader";
import { ArrowLeft, ArrowRight, CircleCheck, CircleCheckBig, Clock } from "lucide-react";
import { useCourse } from "../features/courses/hooks/useCourse";
import { useUpdateLessonProgress } from "../features/lessons/hooks/useUpdateLessonProgress";
import { useSettings } from "../features/settings/hooks/useSettings";
import { useEffect } from "react";

export const LessonPage = () => {
    const { id } = useParams();
    const { data, isLoading, isError } = useLesson(id);
    const { data: course, isLoading: courseLoading } = useCourse(data?.course.id ? String(data.course.id) : undefined);
    const { setting } = useSettings();
    const navigate = useNavigate();
    const { data: progress, isLoading: progressLoading } = useCourseProgress(data?.course.id ? String(data.course.id) : undefined, true);
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

    if (isLoading || courseLoading || progressLoading) {
        return <div>Загрузка урока...</div>
    }
    if (isError) {
        return <div>Ошибка загрузки урока</div>
    }
    if (!data) {
        return <div>Урок не найден</div>
    }
    if (!course) {
        return <div>Курс не найден</div>
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
            <div className="max-w-[1700px] mx-auto px-6 my-8">
                <LessonHeader data={data} progress={progress} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-12">
                    <div className="lg:col-span-8 ">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-10 mb-10">
                            <div className="flex gap-6 items-center mb-10">
                                <p className=" bg-indigo-200 w-fit py-1 px-1.5 text-sm rounded-lg">{data.module.title}</p>
                                <p className="flex items-center gap-2 text-sm text-slate-600"><Clock className="w-4 h-4" />{data.durationMinutes} мин чтения</p>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">{data.title}</h1>
                            <LessonContent content={{ ...data.content, blocks: displayBlocks }} />
                        </div>
                        <div className="flex justify-between">
                            {data.previous ? <Link to={`/lessons/${data.previous.id}`} className="flex items-center gap-2 max-w-[260px] text-indigo-600 hover:text-indigo-800">
                                <ArrowLeft className="w-4 h-4 shrink-0" />
                                <span className="truncate">Предыдущий урок ({data.previous.title})</span>
                            </Link>
                                : <div></div>}
                            {data.completed
                                ? <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shrink-0" onClick={toggleProgress} disabled={mutation.isPending}><CircleCheckBig className="w-4 h-4" /> Урок пройден (отменить)</button>
                                : <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shrink-0" onClick={toggleProgress} disabled={mutation.isPending}><CircleCheckBig className="w-4 h-4" /> Отметить урок как пройденный</button>

                            }
                            {data.next ? <Link to={`/lessons/${data.next.id}`} className="flex items-center gap-2 max-w-[260px] text-indigo-600 hover:text-indigo-800 text-right">
                                <span className="truncate">Следующий урок ({data.next.title})</span>
                                <ArrowRight className="w-4 h-4 shrink-0" />
                            </Link>
                                : <div></div>}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white py-5 px-6 rounded-lg shadow-sm sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
                            <h4 className="font-bold text-lg">Содержание курса</h4>
                            <div>
                                {course.modules.map((module) => (
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
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}