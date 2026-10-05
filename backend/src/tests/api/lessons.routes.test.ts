import request, { type Response } from "supertest";
import app from "../../app.js";
import { cleanupDatabase } from "../infrastructure/database/cleanup.js";

const sampleContent = {
    blocks: [
        {
            type: "paragraph",
            data: { text: "Lesson test content" }
        }
    ]
};

describe("POST /api/lessons", () => {
    let user: Response;
    let course: Response;
    let module: Response;

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
        module = await request(app).post(`/api/courses/${course.body.id}/modules`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Module 1"
        });
    });

    afterEach(async () => {
        await cleanupDatabase();
    });

    test("creation of a lesson by the course owner", async () => {
        const response = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Lesson",
            content: sampleContent,
            durationMinutes: 15,
            moduleId: module.body.id,
            position: 1
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            title: "Test Lesson",
            durationMinutes: 15,
            moduleId: module.body.id,
            position: 1
        });
    });

    test("creation of a lesson by someone other than the course owner", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        const response = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user2.body.token}`).send({
            title: "Test Lesson",
            content: sampleContent,
            durationMinutes: 15,
            moduleId: module.body.id,
            position: 1
        });
        expect(response.status).toBe(403);
    });

    test("creating a lesson for a non-existent module", async () => {
        const response = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Lesson",
            content: sampleContent,
            durationMinutes: 15,
            moduleId: 9999,
            position: 2
        });
        expect(response.status).toBe(403);
    });

    test("successful create of the lesson position without specifying the position", async () => {
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 1",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 1
        });
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 2",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 2
        });
        const last_lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 3",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id
        });
        expect(last_lesson.status).toBe(201);
        expect(last_lesson.body.position).toBe(3);
    });
});

describe("GET /api/courses/:id/lessons", () => {
    let user: Response;
    let course: Response;
    let module: Response;
    let lesson: Response;

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
        module = await request(app).post(`/api/courses/${course.body.id}/modules`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Module 1"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Lesson",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 1
        });
    });

    afterEach(async () => {
        await cleanupDatabase();
    });

    test("successful getting of all lessons in a course", async () => {
        const response = await request(app).get(`/api/courses/${course.body.id}/lessons`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([{
            id: lesson.body.id,
            title: "Test Lesson",
            durationMinutes: 10,
            position: 1,
            moduleId: module.body.id,
            moduleTitle: "Module 1"
        }]);
    });
});

describe("GET /api/lessons/:id", () => {
    let user: Response;
    let course: Response;
    let module: Response;
    let lesson: Response;

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
        module = await request(app).post(`/api/courses/${course.body.id}/modules`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Module 1"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Lesson",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 1
        });
    });

    afterEach(async () => {
        await cleanupDatabase();
    });

    test("successful getting of lessons by id (owner)", async () => {
        const response = await request(app).get(`/api/lessons/${lesson.body.id}`).set("Authorization", `Bearer ${user.body.token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(lesson.body.id);
        expect(response.body.title).toBe("Test Lesson");
    });

    test("successful getting of lessons by id (enrolled user)", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        await request(app).post('/api/enrollments').set("Authorization", `Bearer ${user2.body.token}`).send({
            courseId: course.body.id
        });

        const response = await request(app).get(`/api/lessons/${lesson.body.id}`).set("Authorization", `Bearer ${user2.body.token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(lesson.body.id);
    });

    test("rejects getting lesson when user not enrolled and not owner", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });

        const response = await request(app).get(`/api/lessons/${lesson.body.id}`).set("Authorization", `Bearer ${user2.body.token}`);
        expect(response.status).toBe(403);
    });

    test("successful getting of lessons from a non-existent id", async () => {
        const response = await request(app).get(`/api/lessons/999999`).set("Authorization", `Bearer ${user.body.token}`);
        expect(response.status).toBe(404);
    });
});

describe("PATCH /api/lessons/:id/progress", () => {
    let owner: Response;
    let student: Response;
    let course: Response;
    let module: Response;
    let lesson: Response;

    beforeEach(async () => {
        await request(app).post('/api/users/register').send({
            email: "owner@example.com",
            password: "123556"
        });
        owner = await request(app).post("/api/users/login").send({
            email: "owner@example.com",
            password: "123556"
        });
        course = await request(app).post('/api/courses').set(`Authorization`, `Bearer ${owner.body.token}`).send({
            title: "Test Course",
            description: "Test description",
            category: "Programming"
        });
        module = await request(app).post(`/api/courses/${course.body.id}/modules`).set(`Authorization`, `Bearer ${owner.body.token}`).send({
            title: "Module 1"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${owner.body.token}`).send({
            title: "Test Lesson",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 1
        });

        await request(app).post('/api/users/register').send({
            email: "student@example.com",
            password: "123556"
        });
        student = await request(app).post("/api/users/login").send({
            email: "student@example.com",
            password: "123556"
        });
    });

    afterEach(async () => {
        await cleanupDatabase();
    });

    test("The user is enrolled in the course", async () => {
        await request(app).post('/api/enrollments').set(`Authorization`, `Bearer ${student.body.token}`).send({
            courseId: course.body.id
        });
        const response = await request(app).patch(`/api/lessons/${lesson.body.id}/progress`).set(`Authorization`, `Bearer ${student.body.token}`).send({
            completed: true
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Lesson completed successfully");
    });

    test("The user is not enrolled in the course", async () => {
        const response = await request(app).patch(`/api/lessons/${lesson.body.id}/progress`).set(`Authorization`, `Bearer ${student.body.token}`).send({
            completed: true
        });
        expect(response.status).toBe(403);
    });
});

describe("PATCH /api/lessons/:id", () => {
    let user: Response;
    let course: Response;
    let module: Response;
    let lesson: Response;

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
        module = await request(app).post(`/api/courses/${course.body.id}/modules`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Module 1"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Lesson",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 1
        });
    });

    afterEach(async () => {
        await cleanupDatabase();
    });

    test("successful lesson modification by the owner", async () => {
        const response = await request(app).patch(`/api/lessons/${lesson.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Lesson Patch"
        });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Test Lesson Patch");
    });

    test("attempt by another user to modify the lesson", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });

        const response = await request(app).patch(`/api/lessons/${lesson.body.id}`).set(`Authorization`, `Bearer ${user2.body.token}`).send({
            title: "Test Lesson Patch"
        });
        expect(response.status).toBe(403);
    });

    test("an attempt to modify a non-existent lesson", async () => {
        const response = await request(app).patch(`/api/lessons/99999`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Lesson Patch"
        });
        expect(response.status).toBe(403);
    });

    test("successful change of lesson position (decrease in position)", async () => {
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 2",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 2
        });
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 3",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 3
        });
        const last_lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 4",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 4
        });
        const response = await request(app).patch(`/api/lessons/${last_lesson.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            position: 1
        });
        expect(response.status).toBe(200);
        expect(response.body.position).toBe(1);
    });

    test("successful change of lesson position (increase in position)", async () => {
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 2",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 2
        });
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 3",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 3
        });
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Lesson 4",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 4
        });
        const response = await request(app).patch(`/api/lessons/${lesson.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            position: 4
        });
        expect(response.status).toBe(200);
        expect(response.body.position).toBe(4);
    });
});

describe("DELETE /api/lessons/:id", () => {
    let user: Response;
    let course: Response;
    let module: Response;
    let lesson: Response;

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
        module = await request(app).post(`/api/courses/${course.body.id}/modules`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Module 1"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Lesson",
            content: sampleContent,
            durationMinutes: 10,
            moduleId: module.body.id,
            position: 1
        });
    });

    afterEach(async () => {
        await cleanupDatabase();
    });

    test("successful deletion of the lesson", async () => {
        const response = await request(app).delete(`/api/lessons/${lesson.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`);
        expect(response.status).toBe(200);
    });

    test("rejects deletion of non-existent lesson", async () => {
        const response = await request(app).delete(`/api/lessons/9999999`).set(`Authorization`, `Bearer ${user.body.token}`);
        expect(response.status).toBe(403);
    });

    test("rejects deletion of someone else's lesson", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        const response = await request(app).delete(`/api/lessons/${lesson.body.id}`).set(`Authorization`, `Bearer ${user2.body.token}`);
        expect(response.status).toBe(403);
    });
});