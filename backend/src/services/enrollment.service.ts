import pool from "../db/connection.js";

export async function enrollUser(userId:number, courseId:number) {
    const result = await pool.query(
        `INSERT INTO enrollments
        (user_id, course_id)
        VALUES ($1, $2) RETURNING *`,
        [userId, courseId]
    );
    return result.rows[0];
}

export async function getMyEnrollments(userId:number) {
    const result = await pool.query(
        `SELECT courses.*
        FROM enrollments
        JOIN courses ON courses.id = enrollments.course_id
        WHERE enrollments.user_id = $1`,
        [userId]
    );
    return result.rows;
}

export async function deleteEnrollment(userId: number, courseId: number) {
    return await pool.query(
        `DELETE FROM enrollments
         WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
    );
}

export async function getCourseEnrollments(courseId: number) {
    const result = await pool.query(
        `SELECT users.id, users.email
        FROM enrollments
        JOIN users ON users.id = enrollments.user_id
        WHERE enrollments.course_id = $1`,
        [courseId]
    )
    return result.rows;
}