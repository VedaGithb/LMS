import pool from "../db/connection.js";

export async function isCourseOwner(courseId:number, userId: number) {
    const result = await pool.query(
        `SELECT id
        FROM courses WHERE id=$1 AND user_id=$2`, [courseId, userId]);
    return result.rows.length > 0;
}

export async function isUserEnrolledInCourse(userId: number, courseId: number) {
    const result = await pool.query(
        `SELECT id
        FROM enrollments WHERE user_id=$1 AND course_id=$2`,
        [userId, courseId]
    );
    return result.rows.length > 0;
}

export async function getAllCourses() {
    const result = await pool.query("SELECT * FROM courses");
    return result.rows;
}

export async function getMyCourses(userId: number) {
    const result = await pool.query(
        `SELECT title FROM courses
        WHERE user_id=$1`,
        [userId]
    );
    return result.rows;
}

export async function getCourseById(id: number) {
    const result = await pool.query(
        `SELECT * 
            FROM courses
            WHERE id=$1`,
            [id]
    );
    return result.rows[0];
}

export async function getCourseWithLessons(id: number) {
    const result = await pool.query(
        `SELECT
             c.id,
             c.title,
             c.description,
             COALESCE(
                     json_agg(
                             json_build_object(
                                     'id', l.id,
                                     'title', l.title,
                                     'content', l.content
                             )  ORDER BY l.position ASC
                     ) FILTER (WHERE l.id IS NOT NULL),
                     '[]'::json
             ) AS lessons
         FROM courses AS c
                  LEFT JOIN lessons AS l
                            ON c.id = l.course_id
         WHERE c.id = $1
         GROUP BY c.id, c.title, c.description`,
        [id]
    );

    return result.rows[0];
}

export async function getCourseProgress(userId: number, courseId: number) {
    const result = await pool.query(
        `SELECT lessons.id,
        lessons.title,
        COALESCE(lesson_progress.completed, false) AS completed,
        lesson_progress.completed_at
        FROM lessons
        LEFT JOIN lesson_progress
            ON lessons.id = lesson_progress.lesson_id
            AND lesson_progress.user_id = $1
        WHERE course_id = $2
        ORDER BY lessons.position ASC`,

        [userId, courseId]
    );
    return result.rows;
}

export async function getCourseProgressStats(userId: number, courseId: number) {
    const result = await pool.query(
        `SELECT
            COUNT(*) AS total_lessons,
            COUNT(*) FILTER (
                WHERE completed = true
                AND user_id = $1
            ) AS completed_lessons
        FROM lessons
        LEFT JOIN lesson_progress
            ON lessons.id = lesson_progress.lesson_id
        WHERE lessons.course_id = $2;`,
        [userId, courseId]
    )
    return result.rows;
}

export async function getLessonsByCourseId(courseId: number) {
    const result = await  pool.query(
        `SELECT
            id, 
            title, 
            content 
            FROM lessons 
            WHERE course_id = $1
            ORDER BY position ASC`,
        [courseId]
    );
    return result.rows;
}

export async function createCourse( title: string, description: string, userId: number ) {
    const result = await pool.query(
        `INSERT INTO courses
            (title, description, user_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [title, description, userId]
    );
    return result.rows[0];
}

export async function deleteCourse(id: number, userId: number) {
    return await pool.query(
        `DELETE FROM courses 
        WHERE id=$1 AND user_id=$2`, [id, userId]);
}

export async function updateCourse(id: number, title: string | undefined, description: string | undefined, userId: number) {
    return await pool.query(
        `UPDATE
            courses
            SET title = COALESCE($1, title), 
            description = COALESCE($2, description)
            WHERE id=$3 AND user_id=$4
            RETURNING *`,
            [title, description, id, userId]
    );
}