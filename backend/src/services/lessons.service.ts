import pool from "../db/connection.js";

export async function isLessonOwner(
    lessonId: number,
    userId: number
) {
    const result = await pool.query(
        `
            SELECT l.id
            FROM lessons l
                     JOIN modules m
                          ON m.id = l.module_id
                     JOIN courses c
                          ON c.id = m.course_id
            WHERE l.id = $1
              AND c.owner_id = $2
        `,
        [lessonId, userId]
    );

    return result.rows.length > 0;
}

export async function isUserEnrolled(
    userId: number,
    lessonId: number
) {
    const result = await pool.query(
        `
            SELECT l.id
            FROM lessons l
                     JOIN modules m
                          ON m.id = l.module_id
                     JOIN enrollments e
                          ON e.course_id = m.course_id
            WHERE l.id = $1
              AND e.user_id = $2
        `,
        [lessonId, userId]
    );

    return result.rows.length > 0;
}

export async function getLessonById(id: number) {
    const result = await pool.query(
        `
        SELECT
            l.id,
            l.title,
            l.content,
            l.duration_minutes AS "durationMinutes",
            l.position,

            m.id AS "moduleId",
            m.title AS "moduleTitle",
            m.position AS "modulePosition",

            c.id AS "courseId",
            c.title AS "courseTitle"

        FROM lessons l

        JOIN modules m
            ON m.id = l.module_id

        JOIN courses c
            ON c.id = m.course_id

        WHERE l.id = $1
        `,
        [id]
    );

    return result.rows[0];
}

export async function getLessonForUser(
    lessonId: number,
    userId: number
) {
    const result = await pool.query(
        `
            WITH ordered_lessons AS (
                SELECT
                    l.id,
                    l.title,
                    l.content,
                    l.duration_minutes,
                    l.position,

                    m.id AS module_id,
                    m.title AS module_title,
                    m.position AS module_position,

                    c.id AS course_id,
                    c.title AS course_title,

                    LAG(l.id) OVER (
                    ORDER BY m.position, l.position
                ) AS previous_id,

                    LAG(l.title) OVER (
                    ORDER BY m.position, l.position
                ) AS previous_title,

                    LEAD(l.id) OVER (
                    ORDER BY m.position, l.position
                ) AS next_id,

                    LEAD(l.title) OVER (
                    ORDER BY m.position, l.position
                ) AS next_title

                FROM lessons l

                         JOIN modules m
                              ON m.id = l.module_id

                         JOIN courses c
                              ON c.id = m.course_id

                WHERE c.id = (
                    SELECT m2.course_id
                    FROM lessons l2
                             JOIN modules m2
                                  ON m2.id = l2.module_id
                    WHERE l2.id = $1
                )
            )

            SELECT
                ol.id,
                ol.title,
                ol.content,
                ol.duration_minutes AS "durationMinutes",
                ol.position,

                json_build_object(
                        'id', ol.module_id,
                        'title', ol.module_title,
                        'position', ol.module_position
                ) AS module,

            json_build_object(
                'id', ol.course_id,
                'title', ol.course_title
            ) AS course,

            COALESCE(lp.completed, false) AS completed,
            lp.completed_at AS "completedAt",

            CASE
                WHEN ol.previous_id IS NULL THEN NULL
                ELSE json_build_object(
                    'id', ol.previous_id,
                    'title', ol.previous_title
                )
            END AS previous,

            CASE
                WHEN ol.next_id IS NULL THEN NULL
                ELSE json_build_object(
                    'id', ol.next_id,
                    'title', ol.next_title
                )
            END AS next

        FROM ordered_lessons ol

        LEFT JOIN lesson_progress lp
            ON lp.lesson_id = ol.id
           AND lp.user_id = $2

            WHERE ol.id = $1
        `,
        [lessonId, userId]
    );

    return result.rows[0];
}

export async function createLesson(
    title: string,
    content: object,
    durationMinutes: number,
    moduleId: number,
    position?: number
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const moduleResult = await client.query(
            `
            SELECT id
            FROM modules
            WHERE id = $1
            FOR UPDATE
            `,
            [moduleId]
        );

        if (moduleResult.rows.length === 0) {
            const error = Object.assign(
                new Error("Module not found"),
                { status: 404, code: "MODULE_NOT_FOUND" }
            );

            throw error;
        }

        const maxResult = await client.query(
            `
            SELECT COALESCE(MAX(position), 0) AS max_position
            FROM lessons
            WHERE module_id = $1
            `,
            [moduleId]
        );

        const maxPosition = Number(
            maxResult.rows[0].max_position
        );

        let newPosition = position ?? maxPosition + 1;

        if (
            newPosition < 1 ||
            newPosition > maxPosition + 1
        ) {
            const error = Object.assign(
                new Error("Invalid lesson position"),
                { status: 400, code: "INVALID_POSITION" }
            );

            throw error;
        }

        if (newPosition <= maxPosition) {
            await client.query(
                `
                UPDATE lessons
                SET position = position + 1
                WHERE module_id = $1
                  AND position >= $2
                `,
                [moduleId, newPosition]
            );
        }

        const result = await client.query(
            `
            INSERT INTO lessons
                (
                    title,
                    content,
                    duration_minutes,
                    module_id,
                    position
                )
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                id,
                title,
                content,
                duration_minutes AS "durationMinutes",
                module_id AS "moduleId",
                position
            `,
            [
                title,
                content,
                durationMinutes,
                moduleId,
                newPosition,
            ]
        );

        await client.query("COMMIT");

        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteLesson(
    id: number
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const oldResult = await client.query(
            `
                SELECT module_id, position
                FROM lessons
                WHERE id = $1
                    FOR UPDATE
            `,
            [id]
        );

        if (oldResult.rows.length === 0) {
            const error = Object.assign(
                new Error("Lesson not found"),
                { status: 404, code: "LESSON_NOT_FOUND" }
            );

            throw error;
        }

        const { module_id, position } =
            oldResult.rows[0];

        await client.query(
            `
            UPDATE lessons
            SET position = position - 1
            WHERE module_id = $1
              AND position > $2
            `,
            [module_id, position]
        );

        const result = await client.query(
            `
            DELETE FROM lessons
            WHERE id = $1
            `,
            [id]
        );

        await client.query("COMMIT");

        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function updateLesson(
    id: number,
    title: string | undefined,
    content: object | undefined,
    durationMinutes: number | undefined,
    moduleId: number | undefined,
    position: number | undefined
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const oldResult = await client.query(
            `
                SELECT
                    l.module_id,
                    l.position,
                    m.course_id
                FROM lessons l
                         JOIN modules m
                              ON m.id = l.module_id
                WHERE l.id = $1
                    FOR UPDATE
            `,
            [id]
        );

        if (oldResult.rows.length === 0) {
            const error = Object.assign(
                new Error("Lesson not found"),
                { status: 404, code: "LESSON_NOT_FOUND" }
            );

            throw error;
        }

        const oldModuleId =
            oldResult.rows[0].module_id;

        const oldPosition =
            oldResult.rows[0].position;

        const courseId =
            oldResult.rows[0].course_id;

        let newModuleId =
            moduleId ?? oldModuleId;

        let newPosition =
            position ?? oldPosition;

        if (moduleId !== undefined &&
            moduleId !== oldModuleId) {

            const targetModuleResult =
                await client.query(
                    `
                    SELECT id, course_id
                    FROM modules
                    WHERE id = $1
                    FOR UPDATE
                    `,
                    [moduleId]
                );

            if (
                targetModuleResult.rows.length === 0 ||
                targetModuleResult.rows[0].course_id !== courseId
            ) {
                const error = Object.assign(
                    new Error(
                        "Lesson can only be moved inside the same course"
                    ),
                    {
                        status: 400,
                        code: "INVALID_MODULE",
                    }
                );

                throw error;
            }

            await client.query(
                `
                UPDATE lessons
                SET position = position - 1
                WHERE module_id = $1
                  AND position > $2
                `,
                [oldModuleId, oldPosition]
            );

            const maxResult = await client.query(
                `
                SELECT COALESCE(MAX(position), 0)
                    AS max_position
                FROM lessons
                WHERE module_id = $1
                `,
                [moduleId]
            );

            const maxPosition =
                Number(maxResult.rows[0].max_position);

            newPosition =
                position ?? maxPosition + 1;

            if (
                newPosition < 1 ||
                newPosition > maxPosition + 1
            ) {
                const error = Object.assign(
                    new Error("Invalid lesson position"),
                    {
                        status: 400,
                        code: "INVALID_POSITION",
                    }
                );

                throw error;
            }

            await client.query(
                `
                UPDATE lessons
                SET position = position + 1
                WHERE module_id = $1
                  AND position >= $2
                `,
                [moduleId, newPosition]
            );
        } else if (position !== undefined) {

            if (position > oldPosition) {
                await client.query(
                    `
                    UPDATE lessons
                    SET position = position - 1
                    WHERE module_id = $1
                      AND position > $2
                      AND position <= $3
                    `,
                    [
                        oldModuleId,
                        oldPosition,
                        position,
                    ]
                );
            } else if (position < oldPosition) {
                await client.query(
                    `
                    UPDATE lessons
                    SET position = position + 1
                    WHERE module_id = $1
                      AND position >= $2
                      AND position < $3
                    `,
                    [
                        oldModuleId,
                        position,
                        oldPosition,
                    ]
                );
            }
        }

        const result = await client.query(
            `
            UPDATE lessons
            SET
                title = COALESCE($1, title),
                content = COALESCE($2, content),
                duration_minutes =
                    COALESCE($3, duration_minutes),
                module_id = $4,
                position = $5
            WHERE id = $6
            RETURNING
                id,
                title,
                content,
                duration_minutes AS "durationMinutes",
                module_id AS "moduleId",
                position
            `,
            [
                title,
                content,
                durationMinutes,
                newModuleId,
                newPosition,
                id,
            ]
        );

        await client.query("COMMIT");

        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function setLessonProgress(
    userId: number,
    lessonId: number,
    completed: boolean
) {
    return pool.query(
        `
        INSERT INTO lesson_progress
            (
                user_id,
                lesson_id,
                completed,
                completed_at
            )
        VALUES
            (
                $1,
                $2,
                $3,
                CASE
                    WHEN $3 = true
                    THEN CURRENT_TIMESTAMP
                    ELSE NULL
                END
            )

        ON CONFLICT (user_id, lesson_id)

        DO UPDATE SET
            completed = EXCLUDED.completed,
            completed_at = EXCLUDED.completed_at
        `,
        [
            userId,
            lessonId,
            completed,
        ]
    );
}