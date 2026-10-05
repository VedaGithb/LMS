import type {Course} from "../../features/courses/types"
import {Link} from "react-router-dom";
import {ArrowRight, BookOpenText, Code2} from "lucide-react";
import {formatDuration} from "../../features/courses/utils/formatDuration";

type CourseCardProps = {
    course: Course
};

export const CourseCard = ({course}: CourseCardProps) => {
    return (
        <Link to={`/courses/${course.id}`} className=
                 "bg-white rounded-lg p-6 mx-auto group hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex items-center justify-between mb-10">
                <p className="bg-indigo-200 p-2 rounded-lg text-sm">{course.category}</p>
                <p className="flex items-center gap-2 text-sm"><BookOpenText className="w-5 h-5"/>{course.lessonsCount} уроков</p>
            </div>
            <div className="flex items-center gap-3 mb-5">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <Code2 className="w-6 h-6"/>
                </div>
                <p className="text-2xl font-bold text-slate-900 flex items-center gap-4 group-hover:text-indigo-700 transition-colors">{course.title}</p>
            </div>
            <p className="text-base text-slate-600 leading-relaxed min-h-20">{course.description}</p>
            <div className="flex items-center gap-2 mt-8">
                {course.technologies.map((tech, index) => (
                    <div key={tech} className="flex items-center gap-2">
                        <p className='text-base text-slate-700 bg-indigo-100 px-2 py-1 rounded-lg'>{tech}</p>
                        {index < course.technologies.length - 1 && <span className="w-1 h-1 rounded-full bg-indigo-900"></span>}
                    </div>
                ))}
            </div>
            <div className="mt-8 flex items-center justify-between">
                <p className="text-base text-slate-500">{formatDuration(course.totalDuration)}</p>

                <div className="flex items-center gap-2 text-indigo-800 text-xl">Открыть курс <ArrowRight className="w-6 h-6"/></div>
            </div>
        </Link>
    )
}