import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from 'prisma/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleResponse, RoleResponseSchema } from './dto/role-response.dto';
import { RolePrismaQueryDto } from './dto/role-prisma-query.dto';
import { ApiResponse } from '../../common/interfaces/response.interface';
import { ResponseBuilder } from '../../common/utils/response.builder';
import { RoleInputDto } from './dto/role-input.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getOne(
    roleWhereUniqueInput: Prisma.RoleWhereUniqueInput,
  ): Promise<RoleResponse> {
    const rawRole = await this.prisma.role.findUnique({
      where: roleWhereUniqueInput,
    });

    if (!rawRole) {
      throw new NotFoundException(
        `Role with ID ${roleWhereUniqueInput.id} not found`,
      );
    }

    return RoleResponseSchema.parse(rawRole);
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
  }): Promise<Role[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.role.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getPaginated(
    query: RolePrismaQueryDto,
  ): Promise<ApiResponse<RoleResponse[], Record<string, unknown>>> {
    const { skip, take, search } = query;

    const where: Prisma.RoleWhereInput = search
      ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const rawRoles = await this.getAll({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    });

    const totalItems = await this.prisma.role.count({ where });

    const validatedRoles = rawRoles.map((role) =>
      RoleResponseSchema.parse(role),
    );

    return new ResponseBuilder<RoleResponse[], Record<string, unknown>>()
      .setMessage('Roles list retrivied successfully')
      .setData(validatedRoles)
      .setMeta({
        skip: skip ?? 0,
        take,
        totalItems,
      })
      .build();
  }

  async create(data: RoleInputDto): Promise<RoleResponse> {
    const rawRole = await this.prisma.role.create({
      data,
    });

    return RoleResponseSchema.parse(rawRole);
  }

  async update(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: RoleInputDto;
  }): Promise<RoleResponse> {
    const { where, data } = params;
    const rawRole = await this.prisma.role.update({
      where,
      data,
    });

    return RoleResponseSchema.parse(rawRole);
  }

  async delete(where: Prisma.RoleWhereUniqueInput): Promise<RoleResponse> {
    const rawRole = await this.prisma.role.delete({
      where,
    });

    return RoleResponseSchema.parse(rawRole);
  }
}
