import {Link} from "react-router-dom";
import {
    ArrowRight, ChartLine,
    ChartNoAxesCombined, Clock,
    Code,
    GlobeCheck,
    GraduationCap,
    MoveRight, Network, PanelLeft
} from "lucide-react";
import {CourseCard} from "../shared/components/CourseCard";
import {useCourses} from "../features/courses/hooks/useCourses";

export const HomePage = () => {
    const { data, isLoading, isError } = useCourses({sort: "popular", limit: 3});

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
        <main className="bg-[radial-gradient(circle_at_center,_#dbe4ff_0%,_#eef2ff_45%,_#f8fafc_100%)] min-h-screen">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
                {/* HERO */}
                <section className="mx-auto w-full py-10 sm:py-16">
                    <div className="flex items-center justify-center">
                        <p className="text-center py-1 mt-4 sm:mt-7 bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-medium px-4 sm:px-5 rounded-full flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Учись. Развивайся. Достигай.
                        </p>
                    </div>
                    <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mt-6 sm:mt-10 tracking-tight leading-tight max-w-4xl mx-auto">
                        Онлайн-платформа для системного обучения
                    </h1>
                    <p className="text-center text-base sm:text-xl md:text-2xl text-slate-600 mt-4 sm:mt-5 max-w-3xl mx-auto leading-relaxed">
                        Изучай программирование последовательно: от фундаментальных знаний до практического применения.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
                        <Link
                            to="/courses"
                            className="w-full sm:w-auto justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm text-sm sm:text-base"
                        >
                            Смотреть курсы <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            to="/courses"
                            className="w-full sm:w-auto justify-center bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm text-sm sm:text-base"
                        >
                            <GraduationCap className="h-5 w-5 text-indigo-600" /> Начать обучение
                        </Link>
                    </div>
                </section>

                {/* POPULAR COURSES */}
                <section className="mt-8 px-0 sm:px-4">
                    <span className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                        01 / Каталог
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 mb-4">
                        <h2 className="font-bold text-2xl sm:text-3xl text-slate-900">Популярные курсы</h2>
                        <Link
                            to="/courses"
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm sm:text-base font-medium"
                        >
                            Все программы обучения <MoveRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6 sm:mt-8">
                        {data!.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </section>

                {/* Methodology */}
                <section className="mt-16 px-5 mb-10">
                    <span className="text-base text-indigo-600 uppercase tracking-wider">02 / Методология</span>
                    <h2 className="font-bold text-3xl mt-2">Как устроено обучение</h2>
                    <p className="max-w-3xl mt-3 text-slate-700"> Прозрачный процесс от первого входа до уверенного владения инструментами.
                        Никаких хаотичных роликов — последовательные блоки и обратная связь.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-lg py-6 mx-auto px-8">
                            <div className="flex items-center justify-between my-3">
                                <span className="text-indigo-600 font-bold text-lg">01</span>
                                <GlobeCheck className="h-8 w-8 p-1 bg-indigo-200 rounded-full" />
                            </div>
                            <h2 className="text-xl font-bold mb-4">Выберите курс</h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                Найдите нужную технологию в каталоге и откройте страницу курса.
                                Изучите описание, список технологий, количество уроков, общую продолжительность и структуру программы,
                                чтобы заранее понимать, что вас ждёт в обучении.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg py-6 mx-auto px-8">
                            <div className="flex items-center justify-between my-3">
                                <span className="text-indigo-600 font-bold text-lg">02</span>
                                <Code className="h-8 w-8 p-1 bg-indigo-200 rounded-full" />
                            </div>
                            <h2 className="text-xl font-bold mb-4">Изучайте уроки</h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                Проходите курс последовательно, двигаясь от одного модуля к другому.
                                В каждом уроке изучайте теоретический материал и примеры, а затем переходите дальше
                                или возвращайтесь к уже пройденным темам для повторения.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg py-6 mx-auto px-8">
                            <div className="flex items-center justify-between my-3">
                                <span className="text-indigo-600 font-bold text-lg">03</span>
                                <ChartNoAxesCombined className="h-8 w-8 p-1 bg-indigo-200 rounded-full" />
                            </div>
                            <h2 className="text-xl font-bold mb-4">Отслеживайте прогресс</h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                Отмечайте изученные уроки как завершённые и постепенно двигайтесь к окончанию курса.
                                Платформа показывает процент прохождения, количество завершённых уроков и помогает понять,
                                где вы остановились и что изучать дальше.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Ecosystem */}
                <section className="mt-12 sm:mt-16 px-0 sm:px-4 mb-10">
                    <span className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                        03 / Экосистема
                    </span>
                    <h2 className="font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
                        Преимущества платформы VedaLearn
                    </h2>
                    <p className="max-w-3xl mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                        Мы убрали маркетинговую шелуху и оставили фокус на качественном инжиниринге и регулярной учебной дисциплине.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
                        <div className="bg-white rounded-2xl py-6 px-5 sm:px-6 shadow-sm border border-slate-200/80">
                            <Network className="w-10 h-10 p-2 bg-indigo-50 text-indigo-600 rounded-xl mb-4" />
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 my-2">Структурированное обучение</h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                Курсы разделены на последовательные модули и уроки. Вы всегда видите структуру курса и можете двигаться по программе.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl py-6 px-5 sm:px-6 shadow-sm border border-slate-200/80">
                            <ChartLine className="w-10 h-10 p-2 bg-indigo-50 text-indigo-600 rounded-xl mb-4" />
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 my-2">Наглядный прогресс</h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                После прохождения уроков платформа сохраняет ваш прогресс. Вы можете быстро понять, сколько уроков пройдено.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl py-6 px-5 sm:px-6 shadow-sm border border-slate-200/80">
                            <PanelLeft className="w-10 h-10 p-2 bg-indigo-50 text-indigo-600 rounded-xl mb-4" />
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 my-2">Удобная навигация</h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                Переходите между курсами, модулями и уроками через понятную структуру платформы. Нужный материал легко найти.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl py-6 px-5 sm:px-6 shadow-sm border border-slate-200/80">
                            <Clock className="w-10 h-10 p-2 bg-indigo-50 text-indigo-600 rounded-xl mb-4" />
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 my-2">Комфортный темп</h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                Учитесь в собственном темпе. Можно проходить несколько уроков подряд, сделать перерыв и позже продолжить обучение.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA block */}
                <section className="mt-12 sm:mt-16 mb-10 mx-0 sm:mx-4 bg-indigo-700 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 px-6 sm:px-10 md:px-12 shadow-lg">
                    <div>
                        <p className="text-indigo-200 uppercase text-xs font-semibold tracking-wider mb-2">Старт в удобное время</p>
                        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold max-w-[700px] mb-2">
                            Готовы начать изучение React или TypeScript?
                        </h2>
                        <p className="text-indigo-100 text-sm sm:text-base max-w-[600px]">
                            Присоединяйтесь к платформе сейчас и получите мгновенный доступ ко всем открытым модулям и практическим трекам.
                        </p>
                    </div>
                    <Link
                        to="/courses"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white py-3 px-6 rounded-xl text-indigo-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm shrink-0 text-sm sm:text-base"
                    >
                        Перейти в каталог курсов <ArrowRight className="h-5 w-5" />
                    </Link>
                </section>
            </div>
        </main>
    )
}