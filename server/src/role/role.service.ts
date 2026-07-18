import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create (
    organizationId: string,
    createRoleDto: CreateRoleDto
  ) {
    const existingRole = await this.prismaService.role.findUnique({
      where: {
        organizationId_name: {
          organizationId,
          name: createRoleDto.name,
        },
      },
    });

    if (existingRole) {
      throw new BadRequestException('Role with this name already exists in the organization.');
    }

    const role = await this.prismaService.role.create({
        data: {
            organizationId,
            name: createRoleDto.name,
            description: createRoleDto.description,
        },
    });

    return {
        message: 'Role created successfully',
        data: role,
    };
 }

 async findAll(organizationId: string) {
    const roles = await this.prismaService.role.findMany({
        where: {
            organizationId,
            deletedAt: null,
        },
        orderBy: {
            name: 'asc',
        },
    });

    return {
        message: 'Roles retrieved successfully',
        data: roles,
    };
  }  

  async findOne(
    organizationId: string,
    roleId: string
  ) {
    const role = await this.prismaService.role.findFirst({
      where: {
         id: roleId,
        organizationId,
        deletedAt: null
        },
    });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    return {
      message: 'Role retrieved successfully',
      data: role,
    };
  }

  async update(
    organizationId: string,
    roleId: string,
    updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.prismaService.role.findFirst({
      where: {
        id: roleId,
        organizationId,
        deletedAt: null
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.prismaService.role.findUnique({
        where: {
          organizationId_name: {
            organizationId,
            name: updateRoleDto.name,
          },
        },
      });

      if (existingRole) {
        throw new BadRequestException('Role with this name already exists in the organization.');
      }
    }

    const updatedRole = await this.prismaService.role.update({
      where: {
        id: roleId,
      },
      data: updateRoleDto,
    });

    return {
      message: 'Role updated successfully',
      data: updatedRole,
    };
  }

  async remove(
    organizationId: string,
    roleId: string
  ) {
    const role = await this.prismaService.role.findFirst({
      where: {
        id: roleId,
        organizationId,
        deletedAt: null
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    await this.prismaService.role.update({
      where: {
        id: roleId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Role deleted successfully',
    };
  }
}