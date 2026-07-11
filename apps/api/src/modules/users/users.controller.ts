import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInputDto } from './dto/user-input.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { UserResponse } from './dto/user-response.dto';
import { UserPrismaQueryDto } from './dto/user-prisma-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query() query: UserPrismaQueryDto,
  ): Promise<ApiResponse<UserResponse[], Record<string, unknown>>> {
    return this.usersService.getPaginated(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService.getOne({ id });
  }

  @Post()
  create(@Body() createUserDto: UserInputDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UserInputDto) {
    return this.usersService.update({
      where: { id },
      data: updateUserDto,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete({ id });
  }
}
