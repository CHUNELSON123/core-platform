import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { Req } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
 

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

    const verificationToken = uuid();

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

     await tx.emailVerificationToken.create({
        data: {
            userId: user.id,
            token: verificationToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
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
            verificationToken,
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

  async login(loginDto: LoginDto, request: Request) {
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
        await this.prismaService.session.create({
            data: {
                userId: user.id,
                token,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'] ?? null,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), 
            },
        });
    
    const refreshToken = uuid();
    await this.prismaService.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
        },
    });

    return {
        message: 'Login successful',
        data: {
            accessToken: token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
        },
    },
  }
}

async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const storedToken = await this.prismaService.refreshToken.findUnique({
        where: {
            token: refreshTokenDto.refreshToken,
        },
    });

    if(!storedToken) {
        throw new UnauthorizedException('Invalid refresh token.');
    }

    if (storedToken.isRevoked) {
        throw new UnauthorizedException('Refresh token has been revoked.');
    }

    if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired.');
    }

    const accessToken = await this.jwtService.signAsync({ userId: storedToken.userId });

    return {
        message: 'Token refreshed successfully',
        data: {
            accessToken,
        },
    };
  }

async logout(logoutDto: LogoutDto) {
    const refreshToken = await this.prismaService.refreshToken.findUnique({
        where: {
            token: logoutDto.refreshToken,
        },
    });

    if (!refreshToken) {
        throw new UnauthorizedException('Invalid refresh token.');
    }

    await this.prismaService.refreshToken.update({
        where: {
            id: refreshToken.id,
        },
        data: {
            isRevoked: true,
        },
    });

    await this.prismaService.session.deleteMany({
        where: {
            userId: refreshToken.userId,
            token: {
                not: '',
            }
        },
    });

    return {
        message: 'Logout successful',
    };
 }

async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const verificationToken = await this.prismaService.emailVerificationToken.findUnique({
        where: {
            token: verifyEmailDto.token,
        },
    });

    if (!verificationToken) {
        throw new UnauthorizedException('Invalid verification token.');
    }

    if (verificationToken.isUsed) {
        throw new UnauthorizedException('Verification token has been used.');
    }

    if (verificationToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Verification token has expired.');
    }

    await this.prismaService.$transaction( async (tx) => {  
        await tx.user.update({
            where: {
                id: verificationToken.userId,
            },
            data: {
                emailVerified: true,
            },
        }),
        await tx.emailVerificationToken.update({
            where: {
                id: verificationToken.id,
            },
            data: {
                isUsed: true,
            },
        });
    });

    return {
        message: 'Email verified successfully',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prismaService.user.findUnique({
        where: {
            email: forgotPasswordDto.email,
        },
    });


    //Don't reveal whether the email exists or not for security reasons
    if (!user) {
        return {
            message: 'If the email exists, a password reset link has been sent.',
        };
    }

    const resetToken = uuid();

    await this.prismaService.passwordResetToken.create({
        data: {
            userId: user.id,
            token: resetToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), 
        },
    });

    return {
        message: 'If the email exists, a password reset link has been sent.',
        data: {
            resetToken, //Developer Note: In a real application, you would send this token via email and not return it in the response for security reasons.
        },
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const resetToken = await this.prismaService.passwordResetToken.findUnique({
        where: {
            token: resetPasswordDto.token,
        },
    });

    if (!resetToken) {
        throw new UnauthorizedException('Invalid password reset token.');
    }

    if (resetToken.isUsed) {
        throw new UnauthorizedException('Password reset token has been used.');
    }

    if (resetToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Password reset token has expired.');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.prismaService.$transaction( async (tx) => {
        await tx.user.update({
            where: {
                id: resetToken.userId,
            },
            data: {
                passwordHash: hashedPassword,
            },
        }),

        await tx.passwordResetToken.update({
            where: {
                id: resetToken.id,
            },
            data: {
                isUsed: true,
            },
        });
    });

    return {
        message: 'Password has been reset successfully',
    };
  }
}
