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
import { RolesService } from './roles.service';
import { RolePrismaQueryDto } from './dto/role-prisma-query.dto';
import { ApiResponse } from '../../common/interfaces/response.interface';
import { RoleResponse } from './dto/role-response.dto';
import { RoleInputDto } from './dto/role-input.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(
    @Query() query: RolePrismaQueryDto,
  ): Promise<ApiResponse<RoleResponse[], Record<string, unknown>>> {
    return this.rolesService.getPaginated(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoleResponse> {
    return this.rolesService.getOne({ id });
  }

  @Post()
  create(@Body() createRoleDto: RoleInputDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: RoleInputDto) {
    return this.rolesService.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.rolesService.delete({ id });
  }
}
