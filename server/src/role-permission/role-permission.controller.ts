import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RolePermissionService } from './role-permission.service';

@Controller('role-permissions')
@UseGuards(JwtAuthGuard)
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Post()
  assignPermission(
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    return this.rolePermissionService.assignPermission(
      assignPermissionDto,
    );
  }

  @Get()
  findAll() {
    return this.rolePermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolePermissionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolePermissionService.remove(id);
  }
}