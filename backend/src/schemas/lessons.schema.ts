import { z } from "zod";

const lessonContentSchema = z.object({
    blocks: z.array(
        z.record(z.string(), z.unknown())
    ),
});

export const createLessonsSchema = z.object({
    title: z.string().min(3),
    content: lessonContentSchema,
    durationMinutes: z.number().int().positive(),
    moduleId: z.number().int().positive(),
    position: z.number().int().positive().optional(),
});

export const updateLessonsSchema = createLessonsSchema.partial();

export const lessonProgressSchema = z.object({
    completed: z.boolean().default(true),
});