// src/user/dto/update-user-role.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: Role,
    description: 'The new role for the user',
    example: Role.ADMIN,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}