import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('admin/users')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Put(':id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateRole(id, updateUserRoleDto.role);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
