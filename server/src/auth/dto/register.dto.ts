import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';        

export class RegisterDto {
    @IsString()
    @IsNotEmpty()   
    organizationName!: string;

    @IsString()
    @IsNotEmpty()
    organizationCode!: string;

    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @MinLength(8)
    @IsString()
    @IsNotEmpty()           
    password!: string;

    @IsString()
    @IsOptional()
    phone?: string;
}