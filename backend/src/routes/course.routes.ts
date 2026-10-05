import { Router } from "express";

import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCourseById,
    getMyCourses,
    getCourseProgress,
    getCourseProgressStats,
    isUserEnrolledInCourse,
    updateCourse,
    type CourseFilters
} from "../services/course.service.js";

import {
    createCourseSchema,
    updateCourseSchema,
} from "../schemas/course.schema.js";

import {
    authMiddleware,
} from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.js";
import { validateId } from "../middleware/validateId.js";

const router = Router();

router.get(
    "/",
    async (req, res, next) => {
        try {
            const filters: CourseFilters = {
                limit:
                    typeof req.query.limit === "string"
                        ? Math.min(
                            Number(req.query.limit) || 50,
                            100
                        )
                        : 50,
            };

            if (typeof req.query.q === "string") {
                filters.q = req.query.q;
            }

            if (typeof req.query.category === "string") {
                filters.category = req.query.category;
            }

            if (typeof req.query.technology === "string") {
                filters.technology = req.query.technology;
            }

            if (typeof req.query.sort === "string") {
                filters.sort = req.query.sort;
            }

            const result = await getAllCourses(filters);

            return res.status(200).json(result);
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
            const result = await getMyCourses(
                req.user.userId
            );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/:id/progress",
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

            if (!await isUserEnrolledInCourse(
                userId,
                courseId
            )) {
                return res.status(403).json({
                    message: "You don't have access to this course",
                });
            }

            const result =
                await getCourseProgress(
                    userId,
                    courseId
                );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/:id/progress/stats",
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

            if (!await isUserEnrolledInCourse(
                userId,
                courseId
            )) {
                return res.status(403).json({
                    message: "You don't have access to this course",
                });
            }

            const result =
                await getCourseProgressStats(
                    userId,
                    courseId
                );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/:id/full",
    validateId,
    async (req, res, next) => {
        try {
            const result =
                await getCourseById(
                    Number(req.params.id)
                );

            if (!result) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/:id/lessons",
    validateId,
    async (req, res, next) => {
        try {
            const course =
                await getCourseById(
                    Number(req.params.id)
                );

            if (!course) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            return res.status(200).json(
                course.modules.flatMap(
                    (module: any) =>
                        module.lessons.map(
                            (lesson: any) => ({
                                ...lesson,
                                moduleId: module.id,
                                moduleTitle: module.title,
                                modulePosition: module.position,
                            })
                        )
                )
            );
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/:id",
    validateId,
    async (req, res, next) => {
        try {
            const result =
                await getCourseById(
                    Number(req.params.id)
                );

            if (!result) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    "/",
    authMiddleware,
    validate(createCourseSchema),
    async (req, res, next) => {
        try {
            const {
                title,
                description,
                category,
                prerequisites = [],
                technologyIds = [],
            } = req.body;

            const result = await createCourse(
                title,
                description,
                category,
                prerequisites,
                technologyIds,
                req.user.userId
            );

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    "/:id",
    authMiddleware,
    validateId,
    validate(updateCourseSchema),
    async (req, res, next) => {
        try {
            const {
                title,
                description,
                category,
                prerequisites,
                technologyIds,
            } = req.body;

            const result = await updateCourse(
                Number(req.params.id),
                title,
                description,
                category,
                prerequisites,
                technologyIds,
                req.user.userId
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            return res.status(200).json(
                result.rows[0]
            );
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
            const result = await deleteCourse(
                Number(req.params.id),
                req.user.userId
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    message: "Course not found",
                });
            }

            return res.status(200).json({
                message: "Course deleted",
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;