import request, { type Response } from "supertest";
import app from "../../app.js";
import { cleanupDatabase } from "../infrastructure/database/cleanup.js";

describe("Modules API", () => {
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
    });

    afterEach(async () => {
        await cleanupDatabase();
    });

    test("POST /api/courses/:courseId/modules - creates a new module", async () => {
        const response = await request(app)
            .post(`/api/courses/${course.body.id}/modules`)
            .set(`Authorization`, `Bearer ${user.body.token}`)
            .send({ title: "Module 1" });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            title: "Module 1",
            course_id: course.body.id,
            position: 1
        });
    });

    test("POST /api/courses/:courseId/modules - rejects non-owner", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });

        const response = await request(app)
            .post(`/api/courses/${course.body.id}/modules`)
            .set(`Authorization`, `Bearer ${user2.body.token}`)
            .send({ title: "Module 1" });

        expect(response.status).toBe(403);
    });

    test("PATCH /api/modules/:id - updates module title", async () => {
        const module = await request(app)
            .post(`/api/courses/${course.body.id}/modules`)
            .set(`Authorization`, `Bearer ${user.body.token}`)
            .send({ title: "Module 1" });

        const response = await request(app)
            .patch(`/api/modules/${module.body.id}`)
            .set(`Authorization`, `Bearer ${user.body.token}`)
            .send({ title: "Updated Module" });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Module");
    });

    test("DELETE /api/modules/:id - deletes module", async () => {
        const module = await request(app)
            .post(`/api/courses/${course.body.id}/modules`)
            .set(`Authorization`, `Bearer ${user.body.token}`)
            .send({ title: "Module 1" });

        const response = await request(app)
            .delete(`/api/modules/${module.body.id}`)
            .set(`Authorization`, `Bearer ${user.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Module deleted");
    });
});
