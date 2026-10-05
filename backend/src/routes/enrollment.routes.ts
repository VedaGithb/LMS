import { Router } from "express";

import {
    deleteEnrollment,
    enrollUser,
    getCourseEnrollments,
    getMyEnrollments,
} from "../services/enrollment.service.js";

import {
    getCourseById,
    isCourseOwner,
} from "../services/course.service.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { createEnrollmentSchema } from "../schemas/enrollment.schema.js";
import { validate } from "../middleware/validate.js";
import { validateId } from "../middleware/validateId.js";

const router = Router();

router.post(
    "/",
    authMiddleware,
    validate(createEnrollmentSchema),
    async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { courseId } = req.body;

            const course = await getCourseById(courseId);

            if (!course) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            const result = await enrollUser(
                userId,
                courseId
            );

            if (!result) {
                return res.status(409).json({
                    code: "ALREADY_ENROLLED",
                    message: "User is already enrolled in this course",
                });
            }

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/my",
    authMiddleware,
    async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const result =
                await getMyEnrollments(userId);

            return res.status(200).json(result);
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
            const courseId = Number(req.params.id);
            const userId = req.user.userId;

            const result =
                await deleteEnrollment(
                    userId,
                    courseId
                );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    message: "Enrollment not found",
                });
            }

            return res.status(200).json({
                message: "Enrollment deleted",
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/course/:id",
    authMiddleware,
    validateId,
    async (req, res, next) => {
        try {
            const courseId = Number(req.params.id);
            const userId = req.user.userId;

            const course =
                await getCourseById(courseId);

            if (!course) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            if (!await isCourseOwner(
                courseId,
                userId
            )) {
                return res.status(403).json({
                    message: "You don't have access to this course",
                });
            }

            const result =
                await getCourseEnrollments(courseId);

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;