import pool from "../db/connection.js";

export async function isCourseOwner(courseId: number, userId: number) {
    const result = await pool.query(
        `SELECT id
         FROM courses
         WHERE id = $1
           AND owner_id = $2`,
        [courseId, userId]
    );

    return result.rows.length > 0;
}

export async function isUserEnrolledInCourse(
    userId: number,
    courseId: number
) {
    const result = await pool.query(
        `SELECT id
         FROM enrollments
         WHERE user_id = $1
           AND course_id = $2`,
        [userId, courseId]
    );

    return result.rows.length > 0;
}

export type CourseFilters = {
    q?: string;
    category?: string;
    technology?: string;
    sort?: string;
    limit?: number;
    offset?: number;
};

export async function getAllCourses({
    q,
    category,
    technology,
    sort = "newest",
    limit = 50,
    offset = 0,
}: CourseFilters = {}) {
    const values: unknown[] = [];
    const conditions: string[] = [];

    if (q) {
        values.push(`%${q}%`);
        const param = `$${values.length}`;

        conditions.push(`
            (
                c.title ILIKE ${param}
                OR c.description ILIKE ${param}
                OR EXISTS (
                    SELECT 1
                    FROM course_technologies ct2
                    JOIN technologies t2
                        ON t2.id = ct2.technology_id
                    WHERE ct2.course_id = c.id
                      AND t2.name ILIKE ${param}
                )
            )
        `);
    }

    if (category) {
        values.push(category);
        conditions.push(`c.category = $${values.length}`);
    }

    if (technology) {
        values.push(technology);
        conditions.push(`
            EXISTS (
                SELECT 1
                FROM course_technologies ct3
                JOIN technologies t3
                    ON t3.id = ct3.technology_id
                WHERE ct3.course_id = c.id
                  AND LOWER(t3.name) = LOWER($${values.length})
            )
        `);
    }

    values.push(limit);
    const limitParam = `$${values.length}`;

    values.push(offset);
    const offsetParam = `$${values.length}`;

    const where = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const orderBy =
        sort === "popular"
            ? `COUNT(DISTINCT e.user_id) DESC, c.id DESC`
            : `c.id DESC`;

    const result = await pool.query(
        `
        SELECT
            c.id,
            c.title,
            c.description,
            c.category,

            (
                SELECT COUNT(*)
                FROM lessons l
                JOIN modules m
                    ON m.id = l.module_id
                WHERE m.course_id = c.id
            )::int AS "lessonsCount",
            (
                SELECT COALESCE(SUM(l.duration_minutes), 0)
                FROM lessons l
                         JOIN modules m
                              ON m.id = l.module_id
                WHERE m.course_id = c.id
            )::int AS "totalDuration",

            COALESCE(
                (
                    SELECT json_agg(t.name ORDER BY t.name)
                    FROM course_technologies ct
                    JOIN technologies t
                        ON t.id = ct.technology_id
                    WHERE ct.course_id = c.id
                ),
                '[]'::json
            ) AS technologies,

            COUNT(DISTINCT e.user_id)::int AS "enrollmentsCount"

        FROM courses c

        LEFT JOIN enrollments e
            ON e.course_id = c.id

        ${where}

        GROUP BY c.id

        ORDER BY ${orderBy}

        LIMIT ${limitParam}
        OFFSET ${offsetParam}
        `,
        values
    );

    return result.rows;
}

export async function getMyCourses(userId: number) {
    const result = await pool.query(
        `
            SELECT
                id,
                title,
                description,
                category
            FROM courses
            WHERE owner_id = $1
            ORDER BY id DESC
        `,
        [userId]
    );

    return result.rows;
}

export async function getCourseById(id: number) {
    const result = await pool.query(
        `
            SELECT
                c.id,
                c.title,
                c.description,
                c.category,
                c.prerequisites,

                COALESCE(
                        (
                            SELECT json_agg(t.name ORDER BY t.name)
                            FROM course_technologies ct
                                     JOIN technologies t
                                          ON t.id = ct.technology_id
                            WHERE ct.course_id = c.id
                        ),
                        '[]'::json
                ) AS technologies,

                (
                    SELECT COUNT(*)
                    FROM lessons l
                             JOIN modules m
                                  ON m.id = l.module_id
                    WHERE m.course_id = c.id
                )::int AS "lessonsCount",

                (
                    SELECT COALESCE(SUM(l.duration_minutes), 0)
                    FROM lessons l
                             JOIN modules m
                                  ON m.id = l.module_id
                    WHERE m.course_id = c.id
                )::int AS "totalDuration",

                COALESCE(
                        (
                            SELECT json_agg(
                                           json_build_object(
                                                   'id', m.id,
                                                   'title', m.title,
                                                   'position', m.position,

                                                   'lessons',
                                                   COALESCE(
                                                           (
                                                               SELECT json_agg(
                                                                              json_build_object(
                                                                                      'id', l.id,
                                                                                      'title', l.title,
                                                                                      'position', l.position,
                                                                                      'durationMinutes', l.duration_minutes
                                                                              )
                                                                                  ORDER BY l.position
                                                                      )
                                                               FROM lessons l
                                                               WHERE l.module_id = m.id
                                                           ),
                                                           '[]'::json
                                                   )
                                           )
                                               ORDER BY m.position
                                   )
                            FROM modules m
                            WHERE m.course_id = c.id
                        ),
                        '[]'::json
                ) AS modules

            FROM courses c
            WHERE c.id = $1
        `,
        [id]
    );

    return result.rows[0];
}

export async function getCourseProgress(
    userId: number,
    courseId: number
) {
    const result = await pool.query(
        `
            WITH ordered_lessons AS (
                SELECT
                    l.id,
                    l.title,
                    l.duration_minutes,
                    l.position,
                    m.id AS module_id,
                    m.title AS module_title,
                    m.position AS module_position
                FROM lessons l
                         JOIN modules m
                              ON m.id = l.module_id
                WHERE m.course_id = $2
            )

            SELECT
                ol.id,
                ol.title,
                ol.duration_minutes AS "durationMinutes",
                ol.position,
                ol.module_id AS "moduleId",
                ol.module_title AS "moduleTitle",

                COALESCE(
                        lp.completed,
                        false
                ) AS completed,

                lp.completed_at AS "completedAt"

            FROM ordered_lessons ol

                     LEFT JOIN lesson_progress lp
                               ON lp.lesson_id = ol.id
                                   AND lp.user_id = $1

            ORDER BY ol.module_position, ol.position
        `,
        [userId, courseId]
    );

    const lessons = result.rows;

    const completedLessons = lessons.filter(
        lesson => lesson.completed
    ).length;

    const totalLessons = lessons.length;

    const progressPercent =
        totalLessons === 0
            ? 0
            : Number(
                ((completedLessons / totalLessons) * 100).toFixed(1)
            );

    const nextLesson =
        lessons.find(lesson => !lesson.completed) ?? null;

    return {
        completedLessons,
        totalLessons,
        progressPercent,
        nextLessonId: nextLesson?.id ?? null,
        lessons,
    };
}

export async function getCourseProgressStats(
    userId: number,
    courseId: number
) {
    const progress = await getCourseProgress(
        userId,
        courseId
    );

    return {
        totalLessons: progress.totalLessons,
        completedLessons: progress.completedLessons,
        completedPercent: progress.progressPercent,
    };
}

export async function createCourse(
    title: string,
    description: string,
    category: string,
    prerequisites: string[],
    technologyIds: number[],
    userId: number
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const courseResult = await client.query(
            `
            INSERT INTO courses
                (title, description, category, owner_id, prerequisites)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                title,
                description,
                category,
                userId,
                JSON.stringify(prerequisites),
            ]
        );

        const course = courseResult.rows[0];

        for (const technologyId of technologyIds) {
            await client.query(
                `
                INSERT INTO course_technologies
                    (course_id, technology_id)
                VALUES
                    ($1, $2)
                ON CONFLICT DO NOTHING
                `,
                [course.id, technologyId]
            );
        }

        await client.query("COMMIT");

        return course;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteCourse(
    id: number,
    userId: number
) {
    return pool.query(
        `
        DELETE FROM courses
        WHERE id = $1
          AND owner_id = $2
        `,
        [id, userId]
    );
}

export async function updateCourse(
    id: number,
    title: string | undefined,
    description: string | undefined,
    category: string | undefined,
    prerequisites: string[] | undefined,
    technologyIds: number[] | undefined,
    userId: number
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `
            UPDATE courses
            SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                category = COALESCE($3, category),
                prerequisites = COALESCE($4, prerequisites)
            WHERE id = $5
              AND owner_id = $6
            RETURNING *
            `,
            [
                title,
                description,
                category,
                prerequisites !== undefined
                    ? JSON.stringify(prerequisites)
                    : null,
                id,
                userId,
            ]
        );

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return result;
        }

        if (technologyIds !== undefined) {
            await client.query(
                `
                DELETE FROM course_technologies
                WHERE course_id = $1
                `,
                [id]
            );

            for (const technologyId of technologyIds) {
                await client.query(
                    `
                    INSERT INTO course_technologies
                        (course_id, technology_id)
                    VALUES
                        ($1, $2)
                    ON CONFLICT DO NOTHING
                    `,
                    [id, technologyId]
                );
            }
        }

        await client.query("COMMIT");

        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function getLessonsByCourseId(courseId: number) {
    const result = await pool.query(
        `
        SELECT
            l.id,
            l.title,
            l.duration_minutes AS "durationMinutes",
            l.position,
            m.id AS "moduleId",
            m.title AS "moduleTitle",
            m.position AS "modulePosition"
        FROM lessons l
        JOIN modules m
            ON m.id = l.module_id
        WHERE m.course_id = $1
        ORDER BY m.position, l.position
        `,
        [courseId]
    );

    return result.rows;
}