import { registerUser } from "../../../services/users.service.js";
import pool from "../../../db/connection.js";
import bcrypt from "bcrypt";
import {cleanupDatabase} from "../../infrastructure/database/cleanup.js";

describe("registerUser", () => {

    afterEach(async () => {
        await cleanupDatabase()
    })
    
    test("creates user with hashed password", async () => {
        await registerUser("ivan2@email.com", "123456");
        const user = await pool.query(
            `SELECT email, password FROM users
            WHERE email = $1`,
            ["ivan2@email.com"]
        )
        const isPasswordCorrect = await bcrypt.compare("123456", user.rows[0].password);
        expect(user.rows).toHaveLength(1);
        expect(isPasswordCorrect).toBe(true);
    })

    test("rejects duplicate user", async () => {
        await registerUser("duplicate@email.com", "123456");
        await expect(registerUser("duplicate@email.com", "123456")).rejects.toMatchObject({
            code: "23505",
        });
    })
})