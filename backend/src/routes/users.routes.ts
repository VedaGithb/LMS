import {Router} from "express";
import {loginUserSchema, registerUserSchema} from "../schemas/users.schema.js";
import {validate} from "../middleware/validate.js";
import {loginUser, registerUser} from "../services/users.service.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", validate(registerUserSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await registerUser(email, password);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
})

router.post("/login", validate(loginUserSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);

        if (result === null) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        } else {
            const secret = process.env.JWT_SECRET!;
            const jwttoken = jwt.sign({userId: result.id}, secret);
            const totalResult = {
                user: result,
                token: jwttoken,
            }
            return res.status(200).json(totalResult);
        }
    } catch (error) {
        next(error);
    }
})

export default router;