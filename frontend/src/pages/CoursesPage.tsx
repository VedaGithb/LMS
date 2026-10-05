import {useCourses} from "../features/courses/hooks/useCourses";
import {CourseCard} from "../shared/components/CourseCard";

export const CoursesPage = () => {
    const { data, isLoading, isError } = useCourses()

    if (isLoading) {
        return (
            <h2>Загрузка курсов...</h2>
        )
    }
    if (isError) {
        return (
            <h2>Не удалось загрузить курсы</h2>
        )
    }
    if (data && data.length === 0) {
        return (
            <h2>Курсов пока нет</h2>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-5xl font-bold tracking-tight mb-6">Все курсы</h1>
            <p className="text-xl text-slate-600 mb-10">Выберите курс и начните обучение</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {data?.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    )
}