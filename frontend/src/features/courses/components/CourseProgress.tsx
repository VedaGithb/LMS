import type {CourseProgress as CourseProgressData} from "../../progress/types";
import type {LessonPreview} from "../types.ts";
import {ChartNoAxesColumnIncreasing} from "lucide-react";

type CourseProgressProps = {
    stats: CourseProgressData;
    nextLesson: LessonPreview | undefined;
}

export const CourseProgress = ({stats, nextLesson}: CourseProgressProps) => {
    return (
      <div className="bg-white rounded-lg shadow-sm py-6 border-t border-slate-200 px-8">
          <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                  <ChartNoAxesColumnIncreasing className="w-7 h-7 bg-indigo-600 text-white p-1 rounded-lg" />
                  <h3 className="text-lg font-bold">Прогресс курса</h3>
              </div>
              <p className="text-slate-600 text-lg">{stats.completedLessons} из {stats.totalLessons} уроков завершено <span className="text-black font-bold">({stats.progressPercent.toFixed(1)}%)</span></p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
              <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats.progressPercent}%` }} />
          </div>
          {nextLesson && (
              <div className="flex items-center gap-2 mt-6">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <p className="text-base">
                      Следующий урок к прохождению: <span className="font-bold ml-2">{nextLesson.title}</span>
                  </p>
              </div>

          )}
      </div>
  )
}