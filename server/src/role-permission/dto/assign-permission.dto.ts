import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPermissionDto {
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;

  @IsUUID()
  @IsNotEmpty()
  permissionId!: string;
}