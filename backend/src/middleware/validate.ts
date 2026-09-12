import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export function validate(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validate = schema.safeParse(req.body);

        if (validate.success) {
            req.body = validate.data;
            return next();
        } else {
            return res.status(400).send({
                error: validate.error.issues
            });
        }
    };
}