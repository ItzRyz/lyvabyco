import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserPrismaQuerySchema = z.object({
  skip: z.coerce.number().int().nonnegative().optional(),
  take: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
});

export class UserPrismaQueryDto extends createZodDto(UserPrismaQuerySchema) {}
