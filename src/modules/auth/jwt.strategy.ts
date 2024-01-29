import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { GithubNotFoundException } from 'src/exception/GithubException';
import AuthService from 'src/modules/auth/auth.service';
require('dotenv').config();

@Injectable()
export class JwtStrateGy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    const result = await this.authService.validateUser(payload);
    return result;
  }
}
