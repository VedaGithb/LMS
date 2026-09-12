import { Router } from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {deleteEnrollment, enrollUser, getCourseEnrollments, getMyEnrollments} from "../services/enrollment.service.js";
import {getCourseById, isCourseOwner} from "../services/course.service.js";
import {validateId} from "../middleware/validateId.js";

const router = Router();

router.post('/', authMiddleware, async (req,res, next)=>{
    try {
        const userId = req.user.userId;
        const { courseId } = req.body;
        const existingCourse = await getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({
                message: `Could not find course`,
            })
        }

        const result = await enrollUser(userId, courseId);
        return res.status(201).json(result)
    } catch(error){
        next(error);
    }
});

router.get('/my', authMiddleware, async (req,res,next)=>{
    try {
        const userId = req.user.userId;
        const result = await getMyEnrollments(userId);
        return res.status(200).json(result)
    } catch(error){
        next(error);
    }
});

router.delete('/:id', authMiddleware, validateId, async (req,res,next)=>{
    try{
        const courseId = Number(req.params.id);
        const userId = req.user.userId;
        const result = await deleteEnrollment(userId, courseId);
        if (result.rowCount === 0) {
            res.status(404).json({
                message: "Enrollment not found"
            })
        } else {
            res.status(200).json({
                message: "Enrollment deleted"
            });
        }
    } catch (error) {
        next(error);
    }
})

router.get('/course/:id', authMiddleware, validateId, async (req,res,next)=>{
    try {
        const courseId = Number(req.params.id);
        const userId = req.user.userId;
        const course = await getCourseById(courseId);
        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }
        if (!await isCourseOwner(courseId, userId)) {
            return res.status(403).json({
                message: 'You don`t have access to this course'
            })
        }
        const result = await getCourseEnrollments(courseId);
        return res.status(200).json(result)
    } catch (error) {
        next(error);
    }
})

export default router;