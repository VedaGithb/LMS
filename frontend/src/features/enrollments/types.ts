export interface Enrollment {
    id: number;
    user_id: number;
    course_id: number;
    created_at: string;
}

export interface CurrentLesson{
    id: number;
    title: string;
}

export interface EnrollmentStats{
    activeCourses: number;
    completedLessons: number;
    averageProgress: string;
}

export interface EnrolledCourse{
    id: number;
    title: string;
    description: string;
    category: string;
    lessonsCount: number;
    completedLessons: number;
    progressPercent: number;
    currentLesson: CurrentLesson | null;
}

export interface MyEnrollmentsResponse{
    stats: EnrollmentStats;
    courses: EnrolledCourse[];
}