import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
 

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    // Implement registration logic
    const existingUser = await this.prismaService.user.findUnique({
        where: {
            email: registerDto.email,
        }
    });

    if (existingUser) {
        throw new ConflictException('Email already exists.');
    }


    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const result = await this.prismaService.$transaction( async (tx) => {
        const organization = await tx.organization.create({
        data: {
            name: registerDto.organizationName,
            code: registerDto.organizationCode,
        },
    });

    const user = await tx.user.create({
        data: {
            organizationId: organization.id,
            email: registerDto.email,
            passwordHash: hashedPassword,
        },
    });

    const userProfile = await tx.userProfile.create({
        data: {
            userId: user.id,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            phone: registerDto.phone,
        },
    });
    return {
        organization,
        user,
        userProfile,
        };
    });

    return {
        message: 'Registration completed successfully.',
        data: {
            organization: result.organization,
            user: {
            id: result.user.id,
            organizationId: result.user.organizationId,
            email: result.user.email,
            isActive: result.user.isActive,
            emailVerified: result.user.emailVerified,
            createdAt: result.user.createdAt,
            },
            userProfile: result.userProfile,
        },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
        where: {
            email: loginDto.email,
        },
    });

    if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password.');
    }

    const token = await this.jwtService.signAsync({ userId: user.id });

    return {
        message: 'Login successful',
        data: {
            token,
            user: {
                id: user.id,
                email: user.email,
        },
    },
  }
}
}
