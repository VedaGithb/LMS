import {Router} from "express";
import {
    completeLesson,
    createLesson,
    deleteLesson,
    getAllLessons,
    getLessonById, isLessonOwner, isUserEnrolled,
    updateLesson
} from "../services/lessons.service.js";
import {validate} from "../middleware/validate.js";
import {createLessonsSchema, updateLessonsSchema} from "../schemas/lessons.schema.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {getCourseById, isCourseOwner} from "../services/course.service.js";
import {validateId} from "../middleware/validateId.js";

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const result = await getAllLessons();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validateId, async (req, res, next) => {
    try {
        const result = await getLessonById(Number(req.params.id));
        if (!result) {
            res.status(404).json({
                message: "Lesson not found"
            });
        } else {
            res.json(result);
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', authMiddleware, validate(createLessonsSchema), async (req, res, next) => {
    try {
        const {title, content, course_id} = req.body;
        const userId = req.user.userId;
        const course = await getCourseById(course_id);
        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }
        if (await isCourseOwner(course_id, userId)) {
            const result = await createLesson(title, content, course_id);
            res.status(201).json(result);
        } else {
            res.status(403).json({
                message: "You don't have access to this course",
            })
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authMiddleware, validateId, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.userId;
        const hasLesson = await getLessonById(id);
        if (!hasLesson) {
            return res.status(404).json({
                message: "Lesson not found"
            })
        }
        if (await isLessonOwner(id, userId)) {
            await deleteLesson(id);
            res.status(200).json({
                message: "Lesson deleted"
            });
        } else {
            res.status(403).json({
                message: "You don't have access to this lesson",
            })
        }
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/progress', authMiddleware, validateId, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.userId;
        const lesson = await getLessonById(id);
        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            })
        }
        if (await isUserEnrolled(userId, id)){
            await completeLesson(userId, id)
            return res.status(200).json({
                message: "Lesson completed successfully",
            });
        } else {
            return res.status(403).json({
                message: "You don't have access to this lesson",
            })
        }
    } catch (error) {
        next(error);
    }
})

router.patch('/:id', authMiddleware, validateId, validate(updateLessonsSchema), async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.userId;
        const {title, content, course_id, position} = req.body;
        const hasLesson = await getLessonById(id);
        if (!hasLesson) {
            return res.status(404).json({
                message: "Lesson not found"
            })
        }
        if (!await isLessonOwner(id, userId)) {
            return res.status(403).json({
                message: "You don't have access to this lesson",
            })
        }

        if (course_id !== undefined) {
            if (!await isCourseOwner(course_id, userId)) {
                return res.status(403).json({
                    message: "You don't have access to this course",
                })
            }
        }
        const result = await updateLesson(id, title, content, course_id, position);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export default router;