import { z } from 'zod';

export const taskCreateSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional()
});

export const taskUpdateSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});
