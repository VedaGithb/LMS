import pool from "../db/connection.js";

export async function isLessonOwner(lessonId: number, userId: number) {
    const result = await pool.query(
        `SELECT lessons.id
        FROM lessons 
        JOIN courses ON courses.id = lessons.course_id
        WHERE lessons.id = $1
        AND courses.user_id = $2`,
        [lessonId, userId])
    return result.rows.length > 0;
}

export async function isUserEnrolled(userId: number, lessonId: number) {
    const result = await pool.query(
        `SELECT lessons.id
        FROM lessons
        JOIN courses ON courses.id = lessons.course_id
        JOIN enrollments ON enrollments.course_id = courses.id
        WHERE lessons.id = $1 AND enrollments.user_id = $2`,
        [lessonId, userId]
    )
    return result.rows.length > 0;
}

export async function getAllLessons() {
    const result = await pool.query("SELECT * FROM lessons");
    return result.rows;
}

export async function getLessonById(id: number) {
    const result = await pool.query(
        `SELECT * FROM lessons 
            WHERE id = $1`,
            [id]
    );
    return result.rows[0];
}

export async function createLesson(title: string, content: string, course_id: number) {
    const result = await pool.query(
        `INSERT INTO lessons 
            (title, content, course_id, position)
            VALUES ($1, $2, $3, 
                (
                    SELECT COALESCE(MAX(position), 0) + 1
                    FROM lessons
                    WHERE course_id = $3
                )
            )
            RETURNING *`,
            [title, content, course_id]
    );
    return result.rows[0];
}

export async function deleteLesson(id: number) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const oldResult = await client.query(
            `SELECT position, course_id
        FROM lessons
        WHERE id = $1`,
            [id]
        )
        const oldPosition = oldResult.rows[0].position
        const oldCourseId = oldResult.rows[0].course_id

        await client.query(
            `UPDATE lessons
        SET position = position - 1
        WHERE course_id = $1
            AND position > $2`,
            [oldCourseId, oldPosition]
        )

        const result = await client.query("DELETE FROM lessons WHERE id = $1", [id])
        await client.query("COMMIT")
        return result
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function updateLesson(id: number, title: string | undefined, content: string | undefined, course_id: number | undefined, position: number | undefined) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const oldResult = await client.query(
            `SELECT position, course_id
        FROM lessons
        WHERE id = $1`,
            [id]
        )
        const oldPosition = oldResult.rows[0].position
        const oldCourseId = oldResult.rows[0].course_id
        let newPosition = position;
        if (course_id !== undefined && course_id !== oldCourseId) {
            await client.query(
                `UPDATE lessons
                SET position = position - 1
                WHERE course_id = $1
                    AND position > $2`,
                [oldCourseId, oldPosition]
            )
            if (position !== undefined) {
                await client.query(
                    `UPDATE lessons
                SET position = position + 1
                WHERE course_id = $1
                  AND position >= $2`,
                    [course_id, newPosition]
                )
            } else {
                const result = await client.query(
                    `SELECT COALESCE(MAX(position), 0) + 1 AS position
                    FROM lessons
                    WHERE course_id = $1`,
                    [course_id]
                )
                newPosition = result.rows[0].position
            }
        } else {
            if (position !== undefined && position > oldPosition) {
                await client.query(
                    `UPDATE lessons
            SET position = position - 1
            WHERE course_id = $1
              AND position > $2
              AND position <= $3`,
                    [oldCourseId, oldPosition, position]
                )
            } else if (position !== undefined && position < oldPosition) {
                await client.query(
                    `UPDATE lessons
            SET position = position + 1
            WHERE course_id = $1
              AND position >= $2
              AND position < $3`,
                    [oldCourseId, position, oldPosition]
                )
            }
        }

        const result = await client.query(
            `UPDATE lessons 
        SET title = COALESCE($1, title),
        content = COALESCE($2, content), 
        course_id = COALESCE($3, course_id),
        position = COALESCE($5, position)
        WHERE id=$4 RETURNING *`,
            [title, content, course_id, id, newPosition]
        );
        await client.query("COMMIT")
        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function completeLesson(userId: number, lessonId: number) {
    return await pool.query(
        `INSERT INTO lesson_progress
        (user_id, lesson_id, completed, completed_at)
        VALUES ($1, $2, true, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, lesson_id)
        DO UPDATE SET
            completed = true,
            completed_at = CURRENT_TIMESTAMP`,
        [userId, lessonId]
    );
}