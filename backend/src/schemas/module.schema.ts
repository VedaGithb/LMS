import { z } from "zod";

export const createModuleSchema = z.object({
    title: z.string().min(2),
});

export const updateModuleSchema = createModuleSchema.partial();

export const reorderModuleSchema = z.object({
    position: z.number().int().positive(),
});