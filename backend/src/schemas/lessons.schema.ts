import { z } from "zod";

export const createLessonsSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(3),
    course_id: z.number(),
    position: z.number().int().positive().optional(),
});

export const updateLessonsSchema = createLessonsSchema.partial();