// src/common/guards/roles.guard.ts

//Step 2 features Phân quyền người dùng (RBAC) : Create Role Guard and Role Decorator
//Let's create a guard that will check if a user has the required role:


import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../user/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }
    
    // Get the user from the request
    const { user } = context.switchToHttp().getRequest();
    
    // Ensure user exists and has a role
    if (!user || !user.role) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    
    // Check if the user's role is in the required roles
    const hasRequiredRole = requiredRoles.some(role => user.role === role);
    
    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have sufficient permissions to access this resource');
    }
    
    return true;
  }
}