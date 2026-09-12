import app from '../../app.js'
import request from "supertest"
import {cleanupDatabase} from "../infrastructure/database/cleanup.js";

const correctUser = {
    email: "test1245678@example.com",
    password: "123556"
}
const invalidUserData  = {
    email: "test1245678@example.com",
    password: "123"
}
describe("POST /api/users/register", () => {
    afterEach(async () => {
        await cleanupDatabase()
    })
    test("register correct user", async () => {
        const response = await request(app).post('/api/users/register').send(correctUser)
        expect(response.status).toBe(201)
        expect(response.body.email).toBe("test1245678@example.com")
        expect(response.body.id).toBeTruthy()
        expect(response.body.password).toBeUndefined()
    })

    test("user already exists", async () => {
        await request(app).post('/api/users/register').send(correctUser)
        const response = await request(app).post('/api/users/register').send(correctUser)
        expect(response.status).toBe(409)
    })

    test("rejects invalid registration data", async () => {
        const response = await request(app).post('/api/users/register').send(invalidUserData )

        expect(response.status).toBe(400)
    })
})

describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await request(app).post('/api/users/register').send(correctUser)
    })
    afterEach(async () => {
        await cleanupDatabase()
    })
    test("login correct user", async () => {
        const response = await request(app).post('/api/users/login').send(correctUser)
        expect(response.status).toBe(200)
        expect(response.body.user.email).toBe(correctUser.email)
        expect(response.body.user.id).toBeTruthy()
        expect(response.body.token).toBeTruthy()
        expect(response.body.user.password).toBeUndefined()
    })
    test("rejects invalid login data", async () => {
        const response = await request(app).post('/api/users/login').send(invalidUserData )
        expect(response.status).toBe(400)
    })
    test("login incorrect password", async () => {
        const response = await request(app).post('/api/users/login').send({
            email: "test1245678@example.com",
            password: "123456"
        })
        expect(response.status).toBe(401)
    })
})