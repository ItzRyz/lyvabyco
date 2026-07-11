import { z } from 'zod';

export const UserResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  roleId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
