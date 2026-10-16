import type {Course} from "../../features/courses/types"
import {Link} from "react-router-dom";
import {ArrowRight, BookOpenText, Code2} from "lucide-react";
import {formatDuration} from "../../features/courses/utils/formatDuration";

type CourseCardProps = {
    course: Course
};

export const CourseCard = ({course}: CourseCardProps) => {
    return (
        <Link
            to={`/courses/${course.id}`}
            className="w-full bg-white rounded-2xl p-5 sm:p-6 group hover:shadow-md transition-all duration-300 border border-slate-200/80 flex flex-col justify-between"
        >
            <div>
                <div className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
                    <p className="bg-indigo-100 text-indigo-700 font-medium px-2.5 py-1 rounded-lg text-xs sm:text-sm">
                        {course.category}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                        <BookOpenText className="w-4 h-4 text-slate-400" />
                        {course.lessonsCount} уроков
                    </p>
                </div>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl shrink-0">
                        <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                    </p>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                </p>
            </div>

            <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6">
                    {course.technologies.map((tech) => (
                        <span
                            key={tech}
                            className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                    <p className="text-slate-500 font-medium">{formatDuration(course.totalDuration)}</p>
                    <div className="flex items-center gap-1.5 text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                        Открыть курс <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
};