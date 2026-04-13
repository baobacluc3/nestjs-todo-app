import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.userService.findById(payload.sub);
      return {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
        role: payload.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
