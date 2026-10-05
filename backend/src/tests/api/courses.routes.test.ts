import app from '../../app.js'
import request, {type Response } from "supertest"
import {createCourse} from "../../services/course.service.js";
import {cleanupDatabase} from "../infrastructure/database/cleanup.js";

describe("Middleware", () => {
    afterEach(async () => {
        await cleanupDatabase()
    })
    test("rejects request without token", async () => {
        const response = await request(app).get("/api/courses/my");
        expect(response.status).toBe(401);
    })
    test("rejects request with invalid token", async () => {
        const response2 = await request(app).get("/api/courses/my").set("Authorization", "Bearer 4214124125236134");
        expect(response2.status).toBe(401);
    })
})

describe("GET /api/courses/my", () => {
    afterEach(async () => {
        await cleanupDatabase()
    })
    test("returns user's courses", async () => {
        await request(app).post('/api/users/register').send({
            email: "user1@example.com",
            password: "123556"
        })
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        })
        const user1 = await request(app).post("/api/users/login").send({
            email: "user1@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        await createCourse(
            "My Course",
            "My description",
            "Backend",
            [],
            [],
            user1.body.user.id
        );

        await createCourse(
            "My Course 2",
            "My description 2",
            "Frontend",
            [],
            [],
            user2.body.user.id
        );
        const response = await request(app).get("/api/courses/my").set(`Authorization`, `Bearer ${user1.body.token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ title: "My Course" })]))
        expect(response.body).toHaveLength(1)
        expect(response.body).not.toEqual(expect.arrayContaining([expect.objectContaining({ title: "My Course 2" })]))
    })
})

describe("POST /api/courses", () => {
    let user: Response;
    beforeEach(async () => {
        await request(app).post('/api/users/register').send({
            email: "user@example.com",
            password: "123556"
        });
        user = await request(app).post("/api/users/login").send({
            email: "user@example.com",
            password: "123556"
        });
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("successful creation of the course", async () => {
        const response = await  request(app).post("/api/courses").set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ title: "Test Course", description: "Test description", category: "Programming", owner_id: user.body.user.id })
    });

    test("rejects invalid course data", async () => {
        const response = await  request(app).post("/api/courses").set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "TC",
            description: "TD"
        });
        expect(response.status).toBe(400);
    });
});

describe("DELETE /api/courses/:id", () => {
    let user: Response;
    beforeEach(async () => {
        await request(app).post('/api/users/register').send({
            email: "user@example.com",
            password: "123556"
        });
        user = await request(app).post("/api/users/login").send({
            email: "user@example.com",
            password: "123556"
        });
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("successful course deletion", async () => {
        const course = await  request(app).post("/api/courses").set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        const response = await request(app).delete(`/api/courses/${course.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(200);
    });

    test("rejects deletion of non-existent course", async () => {
        const response = await request(app).delete(`/api/courses/9999999`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(404);
    });

    test("reject to delete someone else's course", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        const course = await request(app).post("/api/courses").set(`Authorization`, `Bearer ${user2.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });

        const response = await request(app).delete(`/api/courses/${course.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(404);
    });
});

describe("PATCH /api/courses/:id", () => {
    let user: Response;
    beforeEach(async () => {
        await request(app).post('/api/users/register').send({
            email: "user@example.com",
            password: "123556"
        });
        user = await request(app).post("/api/users/login").send({
            email: "user@example.com",
            password: "123556"
        });
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("successful course update", async () => {
        const course = await  request(app).post("/api/courses").set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        const response = await request(app).patch(`/api/courses/${course.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course patch",
        })
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            title: "Test Course patch",
            description: "Test description",
            category: "Programming"
        });
    });

    test("rejects invalid course data", async () => {
        const course = await  request(app).post("/api/courses").set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        const response = await request(app).patch(`/api/courses/${course.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "TC",
        })
        expect(response.status).toBe(400);
    })

    test("rejects updating of non-existent course", async () => {
        const response = await request(app).patch(`/api/courses/9999999`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course patch",
        });
        expect(response.status).toBe(404);
    });

    test("reject to update someone else's course", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        const course = await request(app).post("/api/courses").set(`Authorization`, `Bearer ${user2.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });

        const response = await request(app).patch(`/api/courses/${course.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course patch",
        })
        expect(response.status).toBe(404);
    });
})