import type {
    Request,
    Response,
    NextFunction,
} from "express";

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (
        typeof error === "object" &&
        error !== null
    ) {
        const err = error as {
            code?: string;
            constraint?: string;
            status?: number;
            message?: string;
        };

        if (err.status) {
            return res.status(err.status).json({
                code: err.code,
                message: err.message,
            });
        }

        if (err.code === "23505") {
            if (
                err.constraint?.includes("users_email")
            ) {
                return res.status(409).json({
                    code: "EMAIL_ALREADY_EXISTS",
                    message: "Email already exists",
                });
            }

            if (
                err.constraint ===
                "enrollments_user_course_unique"
            ) {
                return res.status(409).json({
                    code: "ALREADY_ENROLLED",
                    message: "User is already enrolled in this course",
                });
            }

            return res.status(409).json({
                code: "DUPLICATE_RESOURCE",
                message: "Resource already exists",
            });
        }

        if (err.code === "23503") {
            return res.status(400).json({
                code: "INVALID_REFERENCE",
                message: "Referenced resource does not exist",
            });
        }
    }

    return res.status(500).json({
        code: "INTERNAL_ERROR",
        message: "Something went wrong",
    });
}