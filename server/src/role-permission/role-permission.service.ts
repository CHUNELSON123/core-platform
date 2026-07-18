import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async assignPermission(
    assignPermissionDto: AssignPermissionDto,
  ) {
    const { roleId, permissionId } = assignPermissionDto;

    const role = await this.prismaService.role.findFirst({
      where: {
        id: roleId,
        deletedAt: null,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    const permission =
      await this.prismaService.permission.findFirst({
        where: {
          id: permissionId,
          deletedAt: null,
        },
      });

    if (!permission) {
      throw new NotFoundException(
        'Permission not found.',
      );
    }

    const existingAssignment =
      await this.prismaService.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });

    if (existingAssignment) {
      throw new BadRequestException(
        'Permission is already assigned to this role.',
      );
    }

    const rolePermission =
      await this.prismaService.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
      });

    return {
      message:
        'Permission assigned to role successfully.',
      data: rolePermission,
    };
  }

  async findAll() {
    const rolePermissions =
        await this.prismaService.rolePermission.findMany({
        where: {
            deletedAt: null,
        },
        include: {
            role: true,
            permission: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        });

    return {
        message:
        'Role permissions retrieved successfully.',
        data: rolePermissions,
    };
  }

  async findOne(id: string) {
    const rolePermission =
        await this.prismaService.rolePermission.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            role: true,
            permission: true,
        },
        });

    if (!rolePermission) {
        throw new NotFoundException(
        'Role permission not found.',
        );
    }

    return {
        message:
        'Role permission retrieved successfully.',
        data: rolePermission,
    };
  }

  async remove(id: string) {
    const rolePermission =
        await this.prismaService.rolePermission.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        });

    if (!rolePermission) {
        throw new NotFoundException(
        'Role permission not found.',
        );
    }

    await this.prismaService.rolePermission.update({
        where: {
        id,
        },
        data: {
        deletedAt: new Date(),
        },
    });

    return {
        message:
        'Permission removed from role successfully.',
    };
  }
}