import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserInputSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email format'),
  image: z.url('Invalid image URL format').nullable().optional(),
  roleId: z.uuid('Invalid role ID format'),
});

export class UserInputDto extends createZodDto(UserInputSchema) {}
