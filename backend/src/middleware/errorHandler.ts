import type {Request, Response, NextFunction} from "express";

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
    if (typeof error === "object" && error !== null) {
        const err = error as { code?: string };
        if (err.code === "23505") {
            return res.status(409).json({
                message: "Already exists"
            });
        }
    }

    return res.status(500).json({
        message: "Something went wrong",
    })
}