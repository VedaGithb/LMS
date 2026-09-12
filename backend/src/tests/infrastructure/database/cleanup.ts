import pool from '../../../db/connection.js'

export async function cleanupDatabase() {
    const result = await pool.query(
        `SELECT current_database()`
    )
    const current_database = result.rows[0].current_database

    if (current_database !== "lms_test") {
        throw new Error("Incorrect database, need test database");
    }

    await pool.query(
        `TRUNCATE users CASCADE`
    )
}