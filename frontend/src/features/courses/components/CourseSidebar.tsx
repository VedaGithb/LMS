import { BadgeCheck, BookOpenText, ChartNoAxesColumnIncreasing, Clock, Layers, ListChecks, SlidersHorizontal } from "lucide-react";
import type { CourseDetails } from "../types";
import { formatDuration } from "../utils/formatDuration";

type CourseSidebarProps = {
    course: CourseDetails;
};

export const CourseSidebar = ({ course }: CourseSidebarProps) => {
    return (
        <div className="flex flex-col gap-6">
            {/* О курсе */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                <div className="flex items-center gap-2 mb-5">
                    <SlidersHorizontal className="w-6 h-6 text-slate-500" />
                    <h3 className="font-bold text-lg text-slate-800">О курсе</h3>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center p-2">
                            <ChartNoAxesColumnIncreasing />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-slate-500 text-sm">Категория</p>
                            <h4 className="font-semibold text-lg">{course.category}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center p-2">
                            <BookOpenText />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-slate-500 text-sm">Модулей в программе</p>
                            <h4 className="font-semibold text-lg">{course.modules.length}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center p-2">
                            <Layers />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-slate-500 text-sm">Стек технологий</p>
                            <h4 className="font-semibold text-lg">{course.technologies.join(", ")}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center p-2">
                            <Clock />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-slate-500 text-sm">Время прохождения</p>
                            <h4 className="font-semibold text-lg">{formatDuration(course.totalDuration)}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Необходимая база */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                <div className="flex items-center gap-2 mb-5">
                    <ListChecks className="w-6 h-6 text-slate-500" />
                    <h3 className="font-bold text-lg text-slate-800">Необходимая база</h3>
                </div>
                <div className="flex flex-col gap-3">
                    {
                        course.prerequisites.length > 0
                            ? course.prerequisites.map((prerequisite) => (
                                <div key={prerequisite} className="flex items-center gap-3">
                                    <BadgeCheck className="w-5 h-5 text-green-500" />
                                    <p className="text-slate-600">{prerequisite}</p>
                                </div>
                            ))
                            : <p className="text-slate-600 ">Специальной подготовки не требуется</p>
                    }
                </div>
            </div>
        </div>
    );
};