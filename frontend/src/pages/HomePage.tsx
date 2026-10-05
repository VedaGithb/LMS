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
            <div className="max-w-[1700px] mx-auto px-6">
                {/*HERO */}
                <section className="mx-auto w-full py-16 rounded-md">
                    <div className="flex items-center justify-center">
                        <p className="text-center py-1 mt-7 bg-indigo-100 text-slate-700 px-5 rounded-3xl flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Учись. Развивайся. Достигай.</p>
                    </div>
                    <h1 className="text-center text-5xl font-bold mt-10">Онлайн-платформа для системного обучения</h1>
                    <p className="text-center text-2xl text-slate-700 mt-5">Изучай программирование последовательно: от фундаментальных знаний до практического применения.</p>
                    <div className="flex items-center justify-center gap-6 mt-8">
                        <Link to="/courses" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">Смотреть курсы<ArrowRight className="h-6 w-6" /></Link>
                        <Link to="/courses" className="bg-white  rounded-lg text-slate-800 px-6 py-3 flex items-center gap-2"><GraduationCap className="h-6 w-6"/> Начать обучение</Link>
                    </div>
                </section>

                { /*POPULAR COURSES */}
                <section className="mt-8 px-5">
                <span className="text-base text-indigo-600 uppercase tracking-wider">
                    01 / Каталог
                </span>
                    <div className="flex items-center justify-between mt-2 mb-3">
                        <h2 className="font-bold text-3xl">Популярные курсы</h2>
                        <Link to="/courses" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">Все программы обучения<MoveRight className="w-6 h-6"/></Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {
                            data!.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))
                        }
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
                <section className="mt-16 px-5 mb-10">
                    <span className="text-base text-indigo-600 uppercase tracking-wider">03 / Экосистема</span>
                    <h2 className="font-bold text-3xl mt-2">Преимущества платформы VedaLearn</h2>
                    <p className="max-w-3xl mt-3 text-slate-700">
                        Мы убрали маркетинговую шелуху и оставили фокус на качественном инжиниринге и регулярной учебной дисциплине.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                        <div className="bg-white rounded-lg py-6 mx-auto px-8">
                            <Network className="w-10 h-10 p-2 bg-indigo-100 rounded-lg mb-4"/>
                            <h3 className="text-lg font-bold my-3">Структурированное обучение</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Курсы разделены на последовательные модули и уроки.
                                Вы всегда видите структуру курса и можете двигаться по программе.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg py-6 mx-auto px-8">
                            <ChartLine className="w-10 h-10 p-2 bg-indigo-100 rounded-lg mb-4"/>
                            <h3 className="text-lg font-bold my-3">Наглядный прогресс</h3>
                            <p className="text-slate-600 leading-relaxed">
                                После прохождения уроков платформа сохраняет ваш прогресс.
                                Вы можете быстро понять, сколько уроков пройдено.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg py-6 mx-auto px-8">
                            <PanelLeft className="w-10 h-10 p-2 bg-indigo-100 rounded-lg mb-4"/>
                            <h3 className="text-lg font-bold my-3">Удобная навигация</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Переходите между курсами, модулями и уроками через понятную структуру платформы.
                                Нужный материал легко найти.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg py-6 mx-auto px-8">
                            <Clock className="w-10 h-10 p-2 bg-indigo-100 rounded-lg mb-4"/>
                            <h3 className="text-lg font-bold my-3">Комфортный темп</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Учитесь в собственном темпе.
                                Можно проходить несколько уроков подряд, сделать перерыв и позже продолжить обучение.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA block */}
                <section className="mt-16 mb-10 mx-5     bg-indigo-700 rounded-xl flex items-center justify-between py-6 px-16">
                    <div>
                        <p className="text-slate-200 uppercase text-sm my-2 font-bold">Старт в удобное время</p>
                        <h2 className="text-slate-100 text-4xl font-bold max-w-[700px] mb-2">Готовы начать изучение React или TypeScript?</h2>
                        <p className="text-slate-100 max-w-[600px] mb-5">Присоединяйтесь к платформе сейчас и получите мгновенный доступ ко всем открытым модулям и практическим трекам.</p>
                    </div>
                    <Link to="/courses" className="flex items-center gap-2 bg-white py-2 px-4 rounded-lg text-indigo-800 hover:bg-slate-100">Перейти в каталог курсов<ArrowRight className="h-6 w-6" /></Link>
                </section>
            </div>
        </main>
    )
}