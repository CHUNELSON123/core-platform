import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;

    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const role = await this.prismaService.role.findFirst({
      where: {
        id: roleId,
        deletedAt: null,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    // Ensure the role belongs to the same organization as the user.
    if (user.organizationId !== role.organizationId) {
      throw new BadRequestException(
        'The selected role does not belong to the user organization.',
      );
    }

    const existingAssignment =
      await this.prismaService.userRole.findUnique({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
      });

    if (existingAssignment) {
      throw new BadRequestException(
        'Role is already assigned to this user.',
      );
    }

    const userRole =
      await this.prismaService.userRole.create({
        data: {
          userId,
          roleId,
        },
      });

    return {
      message: 'Role assigned to user successfully.',
      data: userRole,
    };
  }

  async findAll() {
    const userRoles =
        await this.prismaService.userRole.findMany({
        where: {
            deletedAt: null,
        },
        include: {
            user: true,
            role: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        });

    return {
        message: 'User roles retrieved successfully.',
        data: userRoles,
    };
  }

  async findOne(id: string) {
    const userRole =
        await this.prismaService.userRole.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            user: true,
            role: true,
        },
        });

    if (!userRole) {
        throw new NotFoundException(
        'User role not found.',
        );
    }

    return {
        message: 'User role retrieved successfully.',
        data: userRole,
    };
  }

  async remove(id: string) {
    const userRole =
        await this.prismaService.userRole.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        });

    if (!userRole) {
        throw new NotFoundException(
        'User role not found.',
        );
    }

    await this.prismaService.userRole.update({
        where: {
        id,
        },
        data: {
        deletedAt: new Date(),
        },
    });

    return {
        message: 'Role removed from user successfully.',
    };
  }
}