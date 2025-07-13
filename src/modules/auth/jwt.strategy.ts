import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import AuthService from 'src/modules/auth/auth.service';

@Injectable()
export class JwtStrateGy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies.token;
        }
        return token;
      },
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    const result = await this.authService.validateUser(payload);
    const isValidToken = await this.authService.validateJwtToken(payload);

    if (result && isValidToken) return true;
    throw new HttpException('인증 오류', 401);
  }
}
