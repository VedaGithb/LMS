import { Router } from "express";
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCourseById,
    getCourseWithLessons,
    updateCourse,
    getLessonsByCourseId, getMyCourses, getCourseProgress, isUserEnrolledInCourse, getCourseProgressStats
} from "../services/course.service.js";
import {createCourseSchema, updateCourseSchema} from "../schemas/course.schema.js";
import {validate} from "../middleware/validate.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {validateId} from "../middleware/validateId.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const result = await getAllCourses();

        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/my", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const result = await getMyCourses(userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

router.get("/:id/lessons", validateId, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const course = await getCourseById(id);

        if (!course) {
            res.status(404).json({
                message: "Course not found"
            })
        } else {
            const result = await getLessonsByCourseId(id);
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
});

router.get("/:id/full", validateId, async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const result = await getCourseWithLessons(id);

        if (!result) {
            res.status(404).json({
                message: "Course not found"
            });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
});

router.get("/:id/progress", authMiddleware, validateId, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = Number(req.params.id);
        const course = await getCourseById(id);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        if (await isUserEnrolledInCourse(userId, id)) {
            const result = await getCourseProgress(userId, id);
            return res.status(200).json(result);
        } else {
            res.status(403).json({
                message: "You don't have access to this course",
            })
        }
    } catch (error) {
        next(error);
    }
})

router.get("/:id/progress/stats", authMiddleware, validateId, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = Number(req.params.id);
        const course = await getCourseById(id);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        if (await isUserEnrolledInCourse(userId, id)) {
            const result = await getCourseProgressStats(userId, id);
            const { total_lessons, completed_lessons } = result[0];
            const completedPercent = Number(completed_lessons) / Number(total_lessons) * 100;
            return res.status(200).json({
                totalLessons: Number(total_lessons),
                completedLessons: Number(completed_lessons),
                completedPercent
            });
        } else {
            res.status(403).json({
                message: "You don't have access to this course",
            })
        }
    } catch (error) {
        next(error);
    }
})

router.get("/:id", validateId, async (req, res, next) => {

    try {
        const id = Number(req.params.id);

        const course = await getCourseById(id);

        if (!course) {
            res.status(404).json({
                message: "Course not found"
            });
        } else {
            res.json(course);
        }
    } catch (error) {
        next(error);
    }
});

router.post("/", authMiddleware, validate(createCourseSchema), async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.userId;
        const result = await createCourse(title, description, userId);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", authMiddleware, validateId, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.userId;
        const result = await deleteCourse(id, userId);
        if (result.rowCount === 0) {
            res.status(404).json({
                message: "Course not found"
            })
        } else {
            res.status(200).json({
                message: "Course deleted"
            });
        }
    } catch (error) {
        next(error);
    }
})

router.patch("/:id", authMiddleware, validateId, validate(updateCourseSchema), async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.userId;
        const { title, description } = req.body;
        const result = await updateCourse(id, title, description, userId);
        if (result.rowCount === 0) {
            res.status(404).json({
                message: "Course not found"
            })
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        next(error);
    }
})

export default router;