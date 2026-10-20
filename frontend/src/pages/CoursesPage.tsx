import { AlertCircle, Loader2, Search, X } from "lucide-react";
import { useCourses } from "../features/courses/hooks/useCourses";
import { type ChangeEvent } from "react";
import { CourseCard } from "../shared/components/CourseCard";
import { useCourseFilter } from "../features/courses/hooks/useCourseFilter";
import { pluralize } from "../shared/utils/pluralize";

export const CoursesPage = () => {
    const { data, isLoading, isError, refetch } = useCourses();
    const { filteredCourses, categoryArray, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useCourseFilter(data);

    if (isLoading) {
        return (
            <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex items-center justify-center gap-2">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
                <span className="text-slate-600 font-medium">Загрузка каталога курсов...</span>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen flex flex-col items-center justify-center gap-3">
                <p className="text-slate-700 font-medium">Не удалось загрузить каталог курсов</p>
                <button
                    onClick={() => refetch()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                >
                    Попробовать снова <AlertCircle className="text-red-300" size={18} />
                </button>
            </div>
        );
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {

        setSearchQuery(e.target.value)
    }

    return (
        <main className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 my-6 sm:my-8">
                <section className="bg-white rounded-2xl shadow-sm px-4 sm:px-8 mb-8 sm:mb-10 pb-6 sm:pb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold pt-6">Все курсы</h1>
                    <p className="text-slate-600 mt-2 text-base sm:text-lg max-w-[700px] mb-6 sm:mb-8">
                        Найдите курс для изучения и начните последовательное погружение в технологии
                    </p>
                    <div className="relative w-full flex items-center bg-slate-100 py-0.5 px-3 sm:px-4 rounded-xl mb-4 shadow-sm">
                        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500 shrink-0" />
                        <input
                            type="text"
                            id="search"
                            placeholder="Поиск по названию или технологии..."
                            className="h-11 sm:h-12 ml-2 sm:ml-4 w-full bg-transparent focus:outline-none text-sm sm:text-base"
                            onChange={handleSearchChange}
                            value={searchQuery}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-slate-500 hover:text-slate-900 mr-1 p-1 focus:outline-none shrink-0"
                                aria-label="Очистить поиск"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto max-w-full min-w-0 pb-2 sm:flex-wrap">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`py-2 px-3.5 sm:px-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-xl shrink-0 ${
                                selectedCategory === "all"
                                    ? `bg-indigo-600 shadow-sm text-white`
                                    : `bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900`
                            }`}
                        >
                            Все курсы ({data.length})
                        </button>
                        {categoryArray.map((category) => (
                            <button
                                onClick={() => setSelectedCategory(category)}
                                className={`py-2 px-3.5 sm:px-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-xl shrink-0 ${
                                    selectedCategory === category
                                        ? `bg-indigo-600 shadow-sm text-white`
                                        : `bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900`
                                }`}
                                key={category}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>
                <section className="mt-6 sm:mt-8">
                    <p className="text-slate-900 text-xs sm:text-sm font-medium mb-3">
                        Показано: {filteredCourses.length} {pluralize(filteredCourses.length, "курс", "курса", "курсов")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {filteredCourses.length === 0 && (
                            <h2 className="text-center text-lg sm:text-xl text-slate-500 col-span-full py-12">
                                По вашему запросу ничего не найдено...
                            </h2>
                        )}
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}