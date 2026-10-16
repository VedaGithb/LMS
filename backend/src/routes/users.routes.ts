import { Router } from "express";
import { changePasswordSchema, loginUserSchema, registerUserSchema } from "../schemas/users.schema.js";
import { validate } from "../middleware/validate.js";
import { changePassword, loginUser, registerUser } from "../services/users.service.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.middleware.js";

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
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password",
            })
        } else {
            const secret = process.env.JWT_SECRET!;
            const jwttoken = jwt.sign({ userId: result.id }, secret);
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

router.post("/change-password", authMiddleware, validate(changePasswordSchema), async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        const result = await changePassword(userId, currentPassword, newPassword);

        if (result === null) {
            return res.status(401).json({
                code: "USER_NOT_FOUND",
                message: "User not found",
            });
        }
        if (result === false) {
            return res.status(400).json({
                code: "INVALID_CURRENT_PASSWORD",
                message: "The current password was entered incorrectly"
            });
        }

        return res.status(200).json({
            message: "Password successfully changed"
        })
    } catch (error) {
        next(error)
    }
})

export default router;