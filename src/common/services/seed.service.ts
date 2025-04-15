// src/common/services/seed.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check if admin user exists
    const adminExists = await this.userRepository.findOne({
      where: { email: adminEmail }
    });
    
    if (!adminExists) {
      // Create admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = this.userRepository.create({
        email: adminEmail,
        username: 'admin',
        password: hashedPassword,
        role: Role.ADMIN,
      });
      
      await this.userRepository.save(adminUser);
      
      this.logger.log('Admin user created successfully');
    } else {
      this.logger.log('Admin user already exists, skipping seed');
    }
  }
}