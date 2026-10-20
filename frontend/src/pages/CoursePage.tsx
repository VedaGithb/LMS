import { Link, useNavigate, useParams } from "react-router-dom";
import { useCourseProgress } from "../features/progress/hooks/useCourseProgress";
import { LessonList } from "../features/lessons/components/LessonList";
import { CourseHeader } from "../features/courses/components/CourseHeader";
import { useCourse } from "../features/courses/hooks/useCourse";
import { CourseProgress } from "../features/courses/components/CourseProgress";
import { AlertCircle, House, Loader2 } from "lucide-react";
import { useMyEnroll } from "../features/enrollments/hooks/useMyEnroll";
import { useEnrollCourse } from "../features/enrollments/hooks/useEnrollCourse";
import { useAuth } from "../features/auth/hooks/useAuth";
import { CourseSidebar } from "../features/courses/components/CourseSidebar";


export const CoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth()
    const { data, isLoading, isError, refetch } = useCourse(id);
    const { data: enrollment, isLoading: enrollmentIsLoading, isError: enrollmentIsError, refetch: refetchEnroll } = useMyEnroll();
    const isEnrolled = data
        ? (enrollment?.courses ?? []).some((enroll) => {
            return enroll.id === data.id
        })
        : false;
    const { data: progress, isLoading: progressIsLoading, isError: progressIsError } = useCourseProgress(id, isEnrolled);
    const mutation = useEnrollCourse()

    if (isLoading || enrollmentIsLoading || progressIsLoading) {
        return (
            <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex items-center justify-center gap-2">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
                <span className="text-slate-600 font-medium">Загрузка курса...</span>
            </div>
        );
    }

    if (isError || enrollmentIsError || progressIsError || !data) {
        return (
            <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex flex-col items-center justify-center gap-3">
                <p className="text-slate-700 font-medium">Не удалось загрузить данные курса</p>
                <button
                    onClick={() => {
                        refetch();
                        refetchEnroll();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                >
                    Попробовать снова <AlertCircle className="text-red-300" size={18} />
                </button>
            </div>
        );
    }
    const lessons = data.modules.flatMap((module) => {
        return module.lessons
    })
    const nextLesson = progress
        ? progress.nextLessonId !== null
            ? lessons.find(lesson => lesson.id === progress.nextLessonId)
            : undefined
        : lessons[0];

    let lessonsWithProgress;
    if (progress) {
        lessonsWithProgress = progress.lessons;
    } else {
        lessonsWithProgress = lessons.map((lesson) => {
            return {
                id: lesson.id,
                title: lesson.title,
                position: lesson.position,
                durationMinutes: lesson.durationMinutes,
                completed: false
            }
        })
    }

    const handleStartLearning = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (nextLesson === undefined) {
            return;
        }
        if (isEnrolled) {
            navigate(`/lessons/${nextLesson.id}`)
        } else {
            mutation.mutate(data.id, {
                onSuccess: () => navigate(`/lessons/${nextLesson.id}`)
            });
        }
    }


    return (
        <main className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 my-6 sm:my-8">
                <section className="mb-4 flex flex-wrap items-center text-xs sm:text-sm gap-y-1">
                    <House className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 shrink-0 text-slate-500" />
                    <Link to="/" className="text-slate-600 mr-1 hover:underline">Главная</Link>
                    <span className="text-slate-400 mr-1">/</span>
                    <Link to="/courses" className="text-slate-600 mr-1 hover:underline">Все курсы</Link>
                    <span className="text-slate-400 mr-1">/</span>
                    <p className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-none">{data.title}</p>
                </section>
                <CourseHeader course={data} nextLesson={nextLesson} onStartLearning={handleStartLearning} isPending={mutation.isPending} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    <div className="lg:col-span-8">
                        <div className="my-6 sm:my-8">
                            {progress && <CourseProgress stats={progress} nextLesson={nextLesson} />}
                        </div>
                        <LessonList lessons={lessonsWithProgress} nextLessonId={nextLesson?.id} />
                    </div>
                    <aside className="lg:col-span-4 my-6 sm:my-8">
                        <CourseSidebar course={data} />
                    </aside>
                </div>
            </div>
        </main>
    );
}