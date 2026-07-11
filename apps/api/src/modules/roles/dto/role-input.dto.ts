import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RoleInputSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().nullable().optional(),
});

export class RoleInputDto extends createZodDto(RoleInputSchema) {}
