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
import { AssignRoleDto } from './dto/assign-role.dto';
import { UserRoleService } from './user-role.service';

@Controller('user-roles')
@UseGuards(JwtAuthGuard)
export class UserRoleController {
  constructor(
    private readonly userRoleService: UserRoleService,
  ) {}

  @Post()
  assignRole(
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return this.userRoleService.assignRole(
      assignRoleDto,
    );
  }

  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRoleService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRoleService.remove(id);
  }
}