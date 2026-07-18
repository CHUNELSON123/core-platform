import { BadRequestException, Injectable, NotFoundException, } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdatePermissionDto } from "./dto/update-permission.dto";

@Injectable()
export class PermissionService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createPermissionDto: CreatePermissionDto) {
        const existingPermission = await this.prismaService.permission.findUnique({
            where: { name: createPermissionDto.name },
        });

        if (existingPermission) {
            throw new BadRequestException(`Permission with name ${createPermissionDto.name} already exists.`);
        }

        const permission = await this.prismaService.permission.create({
            data: {
                name: createPermissionDto.name,
                description: createPermissionDto.description,
            },
        });

        return {
            message: "Permission created successfully",
            data: permission,
        }
    }

    async findAll() {
        const permissions =
            await this.prismaService.permission.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                name: 'asc',
            },
            });

        return {
            message: 'Permissions retrieved successfully.',
            data: permissions,
        };
    }

    async findOne(id: string) {
        const permission =
            await this.prismaService.permission.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            });

        if (!permission) {
            throw new BadRequestException(
            'Permission not found.',
            );
        }

        return {
            message: 'Permission retrieved successfully.',
            data: permission,
        };
    }

    async update(
        id: string,
        updatePermissionDto: UpdatePermissionDto,
        ) {
        const permission =
            await this.prismaService.permission.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            });

        if (!permission) {
            throw new NotFoundException(
            'Permission not found.',
            );
        }

        if (
            updatePermissionDto.name &&
            updatePermissionDto.name !== permission.name
        ) {
            const existingPermission =
            await this.prismaService.permission.findUnique({
                where: {
                name: updatePermissionDto.name,
                },
            });

            if (existingPermission) {
            throw new BadRequestException(
                'Permission already exists.',
            );
            }
        }

        const updatedPermission =
            await this.prismaService.permission.update({
            where: {
                id,
            },
            data: updatePermissionDto,
            });

        return {
            message: 'Permission updated successfully.',
            data: updatedPermission,
        };
    }

    async remove(id: string) {
        const permission =
            await this.prismaService.permission.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            });

        if (!permission) {
            throw new NotFoundException(
            'Permission not found.',
            );
        }

        await this.prismaService.permission.update({
            where: {
            id,
            },
            data: {
            deletedAt: new Date(),
            },
        });

        return {
            message: 'Permission deleted successfully.',
        };
    }
}