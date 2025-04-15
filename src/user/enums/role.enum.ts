// src/user/enums/role.enum.ts


//I'll implement Role-Based Access Control (RBAC) for your Todo API with Admin, User, and Guest roles. Let's extend your project with proper role-based authorization:
//Step 1: Create Role Enum and Update User Entity
//First, let's create a role enum and modify the user entity to include a role:

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest',
  }