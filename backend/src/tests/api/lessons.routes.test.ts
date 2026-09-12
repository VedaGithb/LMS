import request, {type Response} from "supertest";
import app from "../../app.js";
import {cleanupDatabase} from "../infrastructure/database/cleanup.js";

describe("POST /api/lessons", () => {
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
            description: "Test description"
        });
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("creation of a lesson by the course owner", async () => {
        const response = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 1
        })
        expect(response.status).toBe(201)
    })

    test("creation of a lesson by someone other than the course owner.", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        const response = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user2.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 1
        })
        expect(response.status).toBe(403)
    })

    test("creating a lesson for a non-existent course", async () => {
        const response = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: 9999,
            position: 2
        })
        expect(response.status).toBe(404)
    })

    test("successful create of the lesson position without specifying the position", async () => {
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 2
        })
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 3
        })
        const last_lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id
        })
        expect(last_lesson.body.position).toBe(3)
    })
})

describe("GET /api/lessons", () => {
    let user: Response;
    let course: Response;
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
            description: "Test description"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 1
        })
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("successful getting of all lessons", async () => {
        const response = await request(app).get('/api/lessons')
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject([{
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 1
        }])
    })
})

describe("GET /api/lessons/:id", () => {
    let user: Response;
    let course: Response;
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
            description: "Test description"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 1
        })
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("successful getting of lessons by id", async () => {
        const response = await request(app).get(`/api/lessons/${lesson.body.id}`)
        expect(response.status).toBe(200)
        expect(response.body.id).toBe(lesson.body.id)
    })

    test("successful getting of lessons from a non-existent id", async () => {
        const response = await request(app).get(`/api/lessons/999999`)
        expect(response.status).toBe(404)
    })
})

describe("PATCH /api/lessons/:id/progress", () => {
    let user: Response;
    let course: Response;
    let lesson: Response;
    let enrollment: Response;
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
            description: "Test description"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 1
        })
        enrollment = await request(app).post('/api/enrollments').set(`Authorization`, `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        })
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("The user is enrolled in the course", async () => {
        const response = await request(app).patch(`/api/lessons/${lesson.body.id}/progress`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(200)
    })

    test("The user is not enrolled in the course", async () => {
        await request(app).post('/api/users/register').send({
            email: "user2@example.com",
            password: "123556"
        });
        const user2 = await request(app).post("/api/users/login").send({
            email: "user2@example.com",
            password: "123556"
        });
        const response = await request(app).patch(`/api/lessons/${lesson.body.id}/progress`).set(`Authorization`, `Bearer ${user2.body.token}`)
        expect(response.status).toBe(403)
    })
})

describe("PATCH /api/lessons/:id", () => {
    let user: Response;
    let course: Response;
    let lesson: Response;
    let enrollment: Response;
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
            description: "Test description"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 1
        })
        enrollment = await request(app).post('/api/enrollments').set(`Authorization`, `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        })
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("successful lesson modification by the owner", async () => {
        const response = await request(app).patch(`/api/lessons/${lesson.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course Patch"
        })
        expect(response.status).toBe(200)
        expect(response.body.title).toBe("Test Course Patch")
    })

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
            title: "Test Course Patch"
        })
        expect(response.status).toBe(403)
    })

    test("an attempt to modify a non-existent lesson", async () => {
        const response = await request(app).patch(`/api/lessons/99999`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course Patch"
        })
        expect(response.status).toBe(404)
    })

    test("successful change of lesson position (decrease in position)", async () => {
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 2
        })
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 3
        })
        const last_lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 4
        })
        const response = await request(app).patch(`/api/lessons/${last_lesson.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            position: 1
        })
        expect(response.status).toBe(200)
        expect(response.body.position).toBe(1)
    })

    test("successful change of lesson position (increase in position)", async () => {
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 2
        })
        await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 3
        })
        const last_lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 4
        })
        const response = await request(app).patch(`/api/lessons/${lesson.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`).send({
            position: 4
        })
        expect(response.status).toBe(200)
        expect(response.body.position).toBe(4)
    })
})

describe("DELETE /api/lessons/:id", () => {
    let user: Response;
    let course: Response;
    let lesson: Response;
    let enrollment: Response;
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
            description: "Test description"
        });
        lesson = await request(app).post('/api/lessons').set(`Authorization`, `Bearer ${user.body.token}`).send({
            title: "Test Course",
            content: "Test description",
            course_id: course.body.id,
            position: 1
        })
        enrollment = await request(app).post('/api/enrollments').set(`Authorization`, `Bearer ${user.body.token}`).send({
            courseId: course.body.id
        })
    })
    afterEach(async () => {
        await cleanupDatabase()
    });

    test("successful deletion of the lesson", async () => {
        const response = await request(app).delete(`/api/lessons/${lesson.body.id}`).set(`Authorization`, `Bearer ${user.body.token}`);
        expect(response.status).toBe(200)
    })

    test("rejects deletion of non-existent lesson", async () => {
        const response = await request(app).delete(`/api/lessons/9999999`).set(`Authorization`, `Bearer ${user.body.token}`)
        expect(response.status).toBe(404);
    });
})