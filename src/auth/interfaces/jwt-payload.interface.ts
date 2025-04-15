// src/auth/interfaces/jwt-payload.interface.ts
import { Role } from "src/user/enums/role.enum";
export interface JwtPayload {
    sub: number;  // user id
    email: string;
    username: string;
    role: Role; // sử dụng enum để có autocomplete & type safety
  }