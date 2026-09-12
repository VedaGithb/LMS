import type {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({ error: "No token provided" });
        }

        if (!authorization.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Invalid authorization format" });
        }

        const token = authorization.slice(7);

        if (!token) {
            return res.status(401).json({ error: "Invalid authorization format" });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = payload as { userId: number };
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Token error"
        })
    }
}