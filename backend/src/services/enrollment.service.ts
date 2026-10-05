import pool from "../db/connection.js";

export async function enrollUser(
    userId: number,
    courseId: number
) {
    const result = await pool.query(
        `
            INSERT INTO enrollments
                (user_id, course_id)
            VALUES
                ($1, $2)
                ON CONFLICT (user_id, course_id)
        DO NOTHING
        RETURNING *
        `,
        [userId, courseId]
    );

    return result.rows[0] ?? null;
}

export async function getMyEnrollments(
    userId: number
) {
    const statsResult = await pool.query(
        `
            WITH course_stats AS (
                SELECT
                    c.id,
                    COUNT(l.id)::int AS total_lessons,
                    COUNT(l.id) FILTER (
                    WHERE lp.completed = true
                )::int AS completed_lessons
                FROM enrollments e
                         JOIN courses c
                              ON c.id = e.course_id
                         LEFT JOIN modules m
                                   ON m.course_id = c.id
                         LEFT JOIN lessons l
                                   ON l.module_id = m.id
                         LEFT JOIN lesson_progress lp
                                   ON lp.lesson_id = l.id
                                       AND lp.user_id = e.user_id
                WHERE e.user_id = $1
                GROUP BY c.id
            )

            SELECT
                COUNT(*) FILTER (
                WHERE completed_lessons < total_lessons
            )::int AS "activeCourses",

                COALESCE(
                        SUM(completed_lessons),
                        0
                )::int AS "completedLessons",

                COALESCE(
                        AVG(
                                CASE
                                    WHEN total_lessons = 0 THEN 0
                                    ELSE (
                                             completed_lessons::numeric
                            / total_lessons
                                             ) * 100
                                    END
                        ),
                        0
                )::numeric(5,1) AS "averageProgress"

            FROM course_stats
        `,
        [userId]
    );

    const coursesResult = await pool.query(
        `
        SELECT
            c.id,
            c.title,
            c.description,
            c.category,

            COUNT(l.id)::int AS "lessonsCount",

            COUNT(l.id) FILTER (
                WHERE lp.completed = true
            )::int AS "completedLessons",

            CASE
                WHEN COUNT(l.id) = 0 THEN 0
                ELSE ROUND(
                    COUNT(l.id) FILTER (
                        WHERE lp.completed = true
                    )::numeric
                    / COUNT(l.id) * 100,
                    1
                )
            END AS "progressPercent",

            (
                SELECT json_build_object(
                    'id', next_lesson.id,
                    'title', next_lesson.title
                )
                FROM lessons next_lesson
                JOIN modules next_module
                    ON next_module.id = next_lesson.module_id
                WHERE next_module.course_id = c.id
                  AND NOT EXISTS (
                      SELECT 1
                      FROM lesson_progress next_progress
                      WHERE next_progress.lesson_id = next_lesson.id
                        AND next_progress.user_id = $1
                        AND next_progress.completed = true
                  )
                ORDER BY next_module.position, next_lesson.position
                LIMIT 1
            ) AS "currentLesson"

        FROM enrollments e

        JOIN courses c
            ON c.id = e.course_id

        LEFT JOIN modules m
            ON m.course_id = c.id

        LEFT JOIN lessons l
            ON l.module_id = m.id

        LEFT JOIN lesson_progress lp
            ON lp.lesson_id = l.id
           AND lp.user_id = $1

        WHERE e.user_id = $1

        GROUP BY c.id

        ORDER BY c.id DESC
        `,
        [userId]
    );

    return {
        stats: statsResult.rows[0],
        courses: coursesResult.rows,
    };
}

export async function deleteEnrollment(
    userId: number,
    courseId: number
) {
    return pool.query(
        `
        DELETE FROM enrollments
        WHERE user_id = $1
          AND course_id = $2
        `,
        [userId, courseId]
    );
}

export async function getCourseEnrollments(
    courseId: number
) {
    const result = await pool.query(
        `
            SELECT
                users.id,
                users.email
            FROM enrollments
                     JOIN users
                          ON users.id = enrollments.user_id
            WHERE enrollments.course_id = $1
            ORDER BY users.id
        `,
        [courseId]
    );

    return result.rows;
}