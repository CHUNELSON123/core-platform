import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';  

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

   @Get()
    findAll(@Req() request) {
      return this.roleService.findAll(request.user.organizationId);
    }

  @Get(':id')
  findOne(@Req() request, @Param('id') roleId: string) {
    return this.roleService.findOne(request.user.organizationId, roleId);
  }

  @Post()
  create(
    @Req() request,
    @Body() createRoleDto: CreateRoleDto
  ) {
    return this.roleService.create(request.user.organizationId, createRoleDto);
  }

  @Patch(':id')
  update(
    @Req() request,
    @Param('id') roleId: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.roleService.update(request.user.organizationId, roleId, updateRoleDto);
  }

  @Delete(':id')
  remove(@Req() request, @Param('id') roleId: string) {
    return this.roleService.remove(request.user.organizationId, roleId);
  }

 
}