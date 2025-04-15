// src/user/user.service.ts
import { ConflictException, Injectable, NotFoundException,ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create a new user
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await this.userRepository.save(newUser);

    // Return the user without password
    return new UserResponseDto(savedUser);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    
    return user;
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return new UserResponseDto(user);
  }


  // Admin methods
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map(user => new UserResponseDto(user));
  }

  async updateRole(id: number, role: Role): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Prevent removing the last admin
    if (user.role === Role.ADMIN && role !== Role.ADMIN) {
      const adminCount = await this.userRepository.count({ where: { role: Role.ADMIN } });
      if (adminCount <= 1) {
        throw new ForbiddenException('Cannot remove the last admin user');
      }
    }
    
    user.role = role;
    const updatedUser = await this.userRepository.save(user);
    
    return new UserResponseDto(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Prevent removing the last admin
    if (user.role === Role.ADMIN) {
      const adminCount = await this.userRepository.count({ where: { role: Role.ADMIN } });
      if (adminCount <= 1) {
        throw new ForbiddenException('Cannot remove the last admin user');
      }
    }
    
    await this.userRepository.remove(user);
  }
}