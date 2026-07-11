import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '../../../prisma/generated/client';
import { UserInputDto } from './dto/user-input.dto';
import { UserResponse, UserResponseSchema } from './dto/user-response.dto';
import { ResponseBuilder } from 'src/common/utils/response.builder';
import { UserPrismaQueryDto } from './dto/user-prisma-query.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserResponse> {
    const rawUser = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    if (!rawUser) {
      throw new NotFoundException(
        `User with ID ${userWhereUniqueInput.id} not found`,
      );
    }

    return UserResponseSchema.parse(rawUser);
  }

  async getAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getPaginated(
    query: UserPrismaQueryDto,
  ): Promise<ApiResponse<UserResponse[], Record<string, unknown>>> {
    const { skip, take, search } = query;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const rawUsers = await this.getAll({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    });

    const totalItems = await this.prisma.user.count({ where });

    const validatedUsers = rawUsers.map((user) =>
      UserResponseSchema.parse(user),
    );

    return new ResponseBuilder<UserResponse[], Record<string, unknown>>()
      .setMessage('Users list retrieved successfully')
      .setData(validatedUsers)
      .setMeta({
        skip: skip ?? 0,
        take,
        totalItems,
      })
      .build();
  }

  async create(data: UserInputDto): Promise<UserResponse> {
    const rawUser = await this.prisma.user.create({
      data,
    });

    return UserResponseSchema.parse(rawUser);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UserInputDto;
  }): Promise<UserResponse> {
    const { where, data } = params;
    const rawUser = await this.prisma.user.update({
      where,
      data,
    });

    return UserResponseSchema.parse(rawUser);
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<UserResponse> {
    const rawUser = await this.prisma.user.delete({
      where,
    });

    return UserResponseSchema.parse(rawUser);
  }
}
