import { Router } from "express";

import {
    createModule,
    updateModule,
    reorderModule,
    deleteModule,
    isModuleOwner,
} from "../services/module.service.js";

import {
    createModuleSchema,
    updateModuleSchema,
    reorderModuleSchema,
} from "../schemas/module.schema.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { validateId } from "../middleware/validateId.js";
import { isCourseOwner } from "../services/course.service.js";

const router = Router();

router.post(
    "/courses/:courseId/modules",
    authMiddleware,
    validateIdForParam("courseId"),
    validate(createModuleSchema),
    async (req, res, next) => {
        try {
            const courseId = Number(req.params.courseId);
            const userId = req.user.userId;

            if (!await isCourseOwner(courseId, userId)) {
                return res.status(403).json({
                    message: "You don't have access to this course",
                });
            }

            const result = await createModule(
                courseId,
                req.body.title
            );

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    "/modules/:id",
    authMiddleware,
    validateId,
    validate(updateModuleSchema),
    async (req, res, next) => {
        try {
            const moduleId = Number(req.params.id);
            const userId = req.user.userId;

            if (!await isModuleOwner(moduleId, userId)) {
                return res.status(403).json({
                    message: "You don't have access to this module",
                });
            }

            const result = await updateModule(
                moduleId,
                req.body.title
            );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    "/modules/:id/reorder",
    authMiddleware,
    validateId,
    validate(reorderModuleSchema),
    async (req, res, next) => {
        try {
            const moduleId = Number(req.params.id);
            const userId = req.user.userId;

            if (!await isModuleOwner(moduleId, userId)) {
                return res.status(403).json({
                    message: "You don't have access to this module",
                });
            }

            const result = await reorderModule(
                moduleId,
                req.body.position
            );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    "/modules/:id",
    authMiddleware,
    validateId,
    async (req, res, next) => {
        try {
            const moduleId = Number(req.params.id);
            const userId = req.user.userId;

            if (!await isModuleOwner(moduleId, userId)) {
                return res.status(403).json({
                    message: "You don't have access to this module",
                });
            }

            const result = await deleteModule(moduleId);

            return res.status(200).json({
                message: "Module deleted",
                deleted: result.rowCount,
            });
        } catch (error) {
            next(error);
        }
    }
);

function validateIdForParam(param: string) {
    return (req: any, res: any, next: any) => {
        const id = Number(req.params[param]);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid ID",
            });
        }

        next();
    };
}

export default router;