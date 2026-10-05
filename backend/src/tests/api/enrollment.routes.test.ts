import request, {type Response} from "supertest";
import app from "../../app.js";
import {cleanupDatabase} from "../infrastructure/database/cleanup.js";

describe("POST /api/enrollments", () => {
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

    test("successful user enrollment in the course", async () => {
        const course = await request(app).post('/api/courses').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        const response = await request(app).post('/api/enrollments').set("Authorization", `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        })
        expect(response.status).toBe(201);
    })

    test("re-enrollment of a user in the same course", async () => {
        const course = await request(app).post('/api/courses').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        await request(app).post('/api/enrollments').set("Authorization", `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        })
        const response = await request(app).post('/api/enrollments').set("Authorization", `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        })
        expect(response.status).toBe(409);
    })

    test("enrollment in a non-existent course", async () => {
        const response = await request(app).post('/api/enrollments').set("Authorization", `Bearer ${user.body.token}`).send({
            courseId: 999999
        })
        expect(response.status).toBe(404);
    })
})

describe("GET /api/enrollments/my", () => {
    let user: Response;
    let course: Response;
    beforeEach(async () => {
        await request(app).post('/api/users/register').send({
            email: "user@example.com",
            password: "123556"
        });
        user = await request(app).post("/api/users/login").send({
            email: "user@example.com",
            password: "123556"
        });
        course = await request(app).post('/api/courses').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("obtaining one's own enrollments", async () => {
        await request(app).post('/api/enrollments').set("Authorization", `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        });
        const response = await request(app).get('/api/enrollments/my').set("Authorization", `Bearer ${user.body.token}`)
        expect(response.status).toBe(200);
        expect(response.body.courses[0].id).toBe(course.body.id)
        expect(response.body.courses[0]).toMatchObject({
            title: "Test Course",
            description: "Test description"
        })
    })
})

describe("DELETE /api/enrollments/:courseId", () => {
    let user: Response;
    let course: Response;
    beforeEach(async () => {
        await request(app).post('/api/users/register').send({
            email: "user@example.com",
            password: "123556"
        });
        user = await request(app).post("/api/users/login").send({
            email: "user@example.com",
            password: "123556"
        });
        course = await request(app).post('/api/courses').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        await request(app).post('/api/enrollments').set("Authorization", `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        });
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("deleting enrollments", async () => {
        const response = await request(app).delete(`/api/enrollments/${course.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(200);
    })

    test("deletion of non-existent enrollments", async () => {
        const response = await request(app).delete(`/api/enrollments/999999`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(404);
    })
})

describe("GET /api/enrollments/course/:courseId", () => {
    let user: Response;
    let course: Response;
    beforeEach(async () => {
        await request(app).post('/api/users/register').send({
            email: "user@example.com",
            password: "123556"
        });
        user = await request(app).post("/api/users/login").send({
            email: "user@example.com",
            password: "123556"
        });
        course = await request(app).post('/api/courses').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        await request(app).post('/api/enrollments').set("Authorization", `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        });
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("successful getting of course enrollments", async () => {
        const response = await request(app).get(`/api/enrollments/course/${course.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(200);
    })

    test("getting of course enrollments of another course", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        const response = await request(app).get(`/api/enrollments/course/${course.body.id}`).set(`Authorization`, `Bearer ${user2.body.token}`)
        expect(response.status).toBe(403);
    })

    test("getting of course enrollments for a non-existent course ", async () => {
        const response = await request(app).get(`/api/enrollments/course/999999`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(404);
    })
})