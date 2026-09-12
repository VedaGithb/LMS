import type {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                error: "No token provided",
            })
        }
        const totalToken = token.replace("Bearer ", "");
        const payload = jwt.verify(totalToken, process.env.JWT_SECRET!);
        req.user = payload as { userId: number };
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Token error"
        })
    }
}