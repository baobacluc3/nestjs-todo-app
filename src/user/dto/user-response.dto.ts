// src/user/dto/user-response.dto.ts
import { Exclude, Expose } from 'class-transformer';
import { Role } from '../enums/role.enum';
@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  role: Role;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}