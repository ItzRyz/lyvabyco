import { z } from 'zod';

export const RoleResponseSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RoleResponse = z.infer<typeof RoleResponseSchema>;
