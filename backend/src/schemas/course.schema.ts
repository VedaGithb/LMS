import { z } from "zod";

const prerequisitesSchema = z.array(
    z.string().min(1)
);

export const createCourseSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    category: z.string().min(2),
    prerequisites: prerequisitesSchema.optional(),
    technologyIds: z.array(z.number().int().positive()).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();