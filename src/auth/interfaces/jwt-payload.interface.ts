import { Role } from 'src/user/enums/role.enum';
export interface JwtPayload {
  sub: number;
  email: string;
  username: string;
  role: Role;
}
