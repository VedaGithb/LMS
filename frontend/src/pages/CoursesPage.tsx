import { Search, X } from "lucide-react";
import { useCourses } from "../features/courses/hooks/useCourses";
import { type ChangeEvent } from "react";
import { CourseCard } from "../shared/components/CourseCard";
import { useCourseFilter } from "../features/courses/hooks/useCourseFilter";
import { pluralize } from "../shared/utils/pluralize";

export const CoursesPage = () => {
    const { data, isLoading, isError } = useCourses();
    const { filteredCourses, categoryArray, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useCourseFilter(data);


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
    if (!data) {
        return (
            <h2>Курсов нет</h2>
        )
    }
    if (data.length === 0) {
        return (
            <h2>Курсов пока нет</h2>
        )
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {

        setSearchQuery(e.target.value)
    }

    return (
        <main className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen">
            <div className="max-w-[1700px] mx-auto px-6 my-8">
                <section className="bg-white rounded-lg px-8 mb-10 pb-10">
                    <h1 className="text-3xl font-bold pt-6">Все курсы</h1>
                    <p className="text-slate-600 mt-2 text-lg max-w-[700px] mb-10">Найдите курс для изучения и начните последовательное погружение в технологии</p>
                    <div className="relative w-full flex items-center bg-slate-100 py-0.5 px-4 rounded-xl mb-4 shadow-sm">
                        <Search className="h-6 w-6 text-slate-500" />
                        <input type="text" id="search" placeholder="Поиск по названию или технологии..." className="h-12 ml-4 w-full focus:outline-none" onChange={handleSearchChange} value={searchQuery} />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-slate-500 hover:text-slate-900 mr-2 p-1 focus:outline-none"
                                aria-label="Очистить поиск"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}

                    </div>
                    <div className="flex gap-3 ">
                        <button onClick={() => setSelectedCategory("all")} className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap rounded-lg ${selectedCategory === "all" ? `bg-indigo-600 shadow-sm hover:bg-indigo-500 text-slate-100` : `bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900`}`}>Все курсы ({data.length})</button>
                        {categoryArray.map((category) => (
                            <button onClick={() => setSelectedCategory(category)} className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap rounded-lg ${selectedCategory === category ? `bg-indigo-600 shadow-sm hover:bg-indigo-500 text-slate-100` : `bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900`}`} key={category}>{category}</button>
                        ))}
                    </div>
                </section>
                <section className="mt-8">
                    <p className="text-slate-900 text-sm mb-2">Показано: {filteredCourses.length} {pluralize(filteredCourses.length, "курс", "курса", "курсов")}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.length === 0 && <h2 className="text-center text-xl text-slate-500 col-span-full">По вашему запросу ничего не найдено...</h2>}
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                        }
                    </div>
                </section>
            </div>
        </main>
    )
}