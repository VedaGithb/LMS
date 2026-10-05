import pool from "../db/connection.js";

beforeAll(async () => {
    await pool.query(`
        INSERT INTO technologies (id, name) VALUES
        (1, 'React'),
        (2, 'JavaScript'),
        (3, 'TypeScript'),
        (4, 'Node.js'),
        (5, 'Express'),
        (6, 'PostgreSQL'),
        (7, 'SQL'),
        (8, 'Git'),
        (9, 'Docker')
        ON CONFLICT (id) DO NOTHING
    `);
});

afterAll(async () => {
    await pool.end();
});