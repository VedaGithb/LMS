import { Router } from "express";

import {
    setLessonProgress,
    createLesson,
    deleteLesson,
    getLessonById,
    getLessonForUser,
    isLessonOwner,
    isUserEnrolled,
    updateLesson,
} from "../services/lessons.service.js";

import {
    createLessonsSchema,
    updateLessonsSchema,
    lessonProgressSchema,
} from "../schemas/lessons.schema.js";

import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateId } from "../middleware/validateId.js";
import { isModuleOwner } from "../services/module.service.js";

const router = Router();

router.get(
    "/:id",
    authMiddleware,
    validateId,
    async (req, res, next) => {
        try {
            const lessonId = Number(req.params.id);
            const userId = req.user.userId;

            const lesson = await getLessonById(lessonId);

            if (!lesson) {
                return res.status(404).json({
                    message: "Lesson not found",
                });
            }

            const allowed =
                await isUserEnrolled(userId, lessonId) ||
                await isLessonOwner(lessonId, userId);

            if (!allowed) {
                return res.status(403).json({
                    message: "You don't have access to this lesson",
                });
            }

            const result = await getLessonForUser(
                lessonId,
                userId
            );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    "/",
    authMiddleware,
    validate(createLessonsSchema),
    async (req, res, next) => {
        try {
            const {
                title,
                content,
                durationMinutes,
                moduleId,
                position,
            } = req.body;

            const userId = req.user.userId;

            if (!await isModuleOwner(moduleId, userId)) {
                return res.status(403).json({
                    message: "You don't have access to this module",
                });
            }

            const result = await createLesson(
                title,
                content,
                durationMinutes,
                moduleId,
                position
            );

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    "/:id",
    authMiddleware,
    validateId,
    async (req, res, next) => {
        try {
            const lessonId = Number(req.params.id);
            const userId = req.user.userId;

            if (!await isLessonOwner(lessonId, userId)) {
                return res.status(403).json({
                    message: "You don't have access to this lesson",
                });
            }

            const lesson = await getLessonById(lessonId);

            if (!lesson) {
                return res.status(404).json({
                    message: "Lesson not found",
                });
            }

            await deleteLesson(lessonId);

            return res.status(200).json({
                message: "Lesson deleted",
            });
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    "/:id/progress",
    authMiddleware,
    validateId,
    validate(lessonProgressSchema),
    async (req, res, next) => {
        try {
            const lessonId = Number(req.params.id);
            const userId = req.user.userId;

            const lesson = await getLessonById(lessonId);

            if (!lesson) {
                return res.status(404).json({
                    message: "Lesson not found",
                });
            }

            if (!await isUserEnrolled(userId, lessonId)) {
                return res.status(403).json({
                    message: "You don't have access to this lesson",
                });
            }

            await setLessonProgress(
                userId,
                lessonId,
                req.body.completed
            );

            return res.status(200).json({
                message: req.body.completed
                    ? "Lesson completed successfully"
                    : "Lesson marked as incomplete",
            });
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    "/:id",
    authMiddleware,
    validateId,
    validate(updateLessonsSchema),
    async (req, res, next) => {
        try {
            const lessonId = Number(req.params.id);
            const userId = req.user.userId;

            if (!await isLessonOwner(lessonId, userId)) {
                return res.status(403).json({
                    message: "You don't have access to this lesson",
                });
            }

            const {
                title,
                content,
                durationMinutes,
                moduleId,
                position,
            } = req.body;

            if (
                moduleId !== undefined &&
                !await isModuleOwner(moduleId, userId)
            ) {
                return res.status(403).json({
                    message: "You don't have access to this module",
                });
            }

            const result = await updateLesson(
                lessonId,
                title,
                content,
                durationMinutes,
                moduleId,
                position
            );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;