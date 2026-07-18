import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    RoleModule, 
    PermissionModule, 
    RolePermissionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
