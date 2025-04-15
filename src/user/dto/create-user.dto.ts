// src/user/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength ,IsOptional,IsEnum} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: Role,
    description: 'The role of the user',
    default: Role.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER;
}