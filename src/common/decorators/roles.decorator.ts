// src/common/decorators/roles.decorator.ts

//Step 2 features Phân quyền người dùng (RBAC) : Create Role Guard and Role Decorator
//Let's create a guard that will check if a user has the required role:

import { SetMetadata } from '@nestjs/common';
import { Role } from '../../user/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);