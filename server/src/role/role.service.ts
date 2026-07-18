import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

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
}