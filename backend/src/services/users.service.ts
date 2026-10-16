import pool from "../db/connection.js";
import bcrypt from "bcrypt";


export async function registerUser(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
        `INSERT INTO users
        (email, password) 
        VALUES ($1, $2) RETURNING id, email`,
        [email, hash]
    );
    return result.rows[0];
}

export async function loginUser(email: string, password: string) {
    const user = await pool.query(
        `SELECT * FROM users
        WHERE email = $1`, [email]
    );

    if (user.rows.length === 0) {
        return null;
    }

    const thisUser = user.rows[0];

    const pass = await bcrypt.compare(password, thisUser.password);
    if (pass) {
        return {
            id: thisUser.id,
            email: thisUser.email
        };
    } else {
        return null;
    }
}

export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
    const result = await pool.query(
        `SELECT password FROM users WHERE id=$1`,
        [userId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    if (!await bcrypt.compare(currentPassword, result.rows[0].password)) return false;

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query(
        `UPDATE users SET password = $1 WHERE id=$2`,
        [hash, userId]
    );
    return true;
}