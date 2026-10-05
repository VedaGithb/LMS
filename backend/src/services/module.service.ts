import pool from "../db/connection.js";

export async function isModuleOwner(
    moduleId: number,
    userId: number
) {
    const result = await pool.query(
        `
        SELECT m.id
        FROM modules m
        JOIN courses c
            ON c.id = m.course_id
        WHERE m.id = $1
          AND c.owner_id = $2
        `,
        [moduleId, userId]
    );

    return result.rows.length > 0;
}

export async function createModule(
    courseId: number,
    title: string
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const course = await client.query(
            `
            SELECT id
            FROM courses
            WHERE id = $1
            FOR UPDATE
            `,
            [courseId]
        );

        if (course.rows.length === 0) {
            const error = Object.assign(
                new Error("Course not found"),
                { status: 404, code: "COURSE_NOT_FOUND" }
            );

            throw error;
        }

        const positionResult =
            await client.query(
                `
                SELECT COALESCE(MAX(position), 0) + 1
                    AS position
                FROM modules
                WHERE course_id = $1
                `,
                [courseId]
            );

        const position =
            positionResult.rows[0].position;

        const result = await client.query(
            `
            INSERT INTO modules
                (course_id, title, position)
            VALUES
                ($1, $2, $3)
            RETURNING *
            `,
            [courseId, title, position]
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

export async function updateModule(
    id: number,
    title: string | undefined
) {
    const result = await pool.query(
        `
        UPDATE modules
        SET title = COALESCE($1, title)
        WHERE id = $2
        RETURNING *
        `,
        [title, id]
    );

    return result.rows[0];
}

export async function reorderModule(
    id: number,
    position: number
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const oldResult = await client.query(
            `
            SELECT course_id, position
            FROM modules
            WHERE id = $1
            FOR UPDATE
            `,
            [id]
        );

        if (oldResult.rows.length === 0) {
            const error = Object.assign(
                new Error("Module not found"),
                { status: 404, code: "MODULE_NOT_FOUND" }
            );

            throw error;
        }

        const {
            course_id,
            position: oldPosition,
        } = oldResult.rows[0];

        const countResult = await client.query(
            `
            SELECT COUNT(*)::int AS count
            FROM modules
            WHERE course_id = $1
            `,
            [course_id]
        );

        const count =
            countResult.rows[0].count;

        if (position < 1 || position > count) {
            const error = Object.assign(
                new Error("Invalid module position"),
                { status: 400, code: "INVALID_POSITION" }
            );

            throw error;
        }

        if (position > oldPosition) {
            await client.query(
                `
                UPDATE modules
                SET position = position - 1
                WHERE course_id = $1
                  AND position > $2
                  AND position <= $3
                `,
                [course_id, oldPosition, position]
            );
        } else if (position < oldPosition) {
            await client.query(
                `
                UPDATE modules
                SET position = position + 1
                WHERE course_id = $1
                  AND position >= $2
                  AND position < $3
                `,
                [course_id, position, oldPosition]
            );
        }

        const result = await client.query(
            `
            UPDATE modules
            SET position = $1
            WHERE id = $2
            RETURNING *
            `,
            [position, id]
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

export async function deleteModule(
    id: number
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const oldResult = await client.query(
            `
            SELECT course_id, position
            FROM modules
            WHERE id = $1
            FOR UPDATE
            `,
            [id]
        );

        if (oldResult.rows.length === 0) {
            const error = Object.assign(
                new Error("Module not found"),
                { status: 404, code: "MODULE_NOT_FOUND" }
            );

            throw error;
        }

        const {
            course_id,
            position,
        } = oldResult.rows[0];

        await client.query(
            `
            UPDATE modules
            SET position = position - 1
            WHERE course_id = $1
              AND position > $2
            `,
            [course_id, position]
        );

        const result = await client.query(
            `
            DELETE FROM modules
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
