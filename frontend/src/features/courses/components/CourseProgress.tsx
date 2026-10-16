import type {CourseProgress as CourseProgressData} from "../../progress/types";
import type {LessonPreview} from "../types.ts";
import {ChartNoAxesColumnIncreasing} from "lucide-react";

type CourseProgressProps = {
    stats: CourseProgressData;
    nextLesson: LessonPreview | undefined;
}

export const CourseProgress = ({stats, nextLesson}: CourseProgressProps) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm py-5 sm:py-6 border border-slate-200/80 px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                  <ChartNoAxesColumnIncreasing className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-600 text-white p-1 rounded-lg shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Прогресс курса</h3>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base">
                  {stats.completedLessons} из {stats.totalLessons} уроков завершено{" "}
                  <span className="text-slate-900 font-bold">({stats.progressPercent.toFixed(1)}%)</span>
              </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
              <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats.progressPercent}%` }} />
          </div>
          {nextLesson && (
              <div className="flex items-center gap-2 mt-4 sm:mt-6 text-xs sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0"></span>
                  <p className="text-slate-700 truncate">
                      Следующий урок к прохождению: <span className="font-bold text-slate-900 ml-1">{nextLesson.title}</span>
                  </p>
              </div>
          )}
      </div>
  );
};