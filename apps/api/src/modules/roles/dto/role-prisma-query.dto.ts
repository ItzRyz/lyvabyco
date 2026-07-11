// src/modules/users/dto/user-prisma-query.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RolePrismaQuerySchema = z.object({
  skip: z.coerce.number().int().nonnegative().optional(),
  take: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
});

export class RolePrismaQueryDto extends createZodDto(RolePrismaQuerySchema) {}
