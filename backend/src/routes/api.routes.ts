import { Router } from "express";

import courseRoutes from "./course.routes.js";
import lessonsRoutes from "./lessons.routes.js";
import usersRoutes from "./users.routes.js";
import enrollmentRoutes from "./enrollment.routes.js";
import moduleRoutes from "./module.routes.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "LMS API works!",
    });
});

router.use("/courses", courseRoutes);
router.use("/", moduleRoutes);
router.use("/lessons", lessonsRoutes);
router.use("/users", usersRoutes);
router.use("/enrollments", enrollmentRoutes);

export default router;