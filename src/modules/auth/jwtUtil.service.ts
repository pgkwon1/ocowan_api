import * as jwt from 'jsonwebtoken';

export class JwtUtilService {
  constructor() {}

  static generateJwtToken(
    login: string,
    id: string,
    access_token: string,
  ): string {
    return jwt.sign({ login, id, access_token }, process.env.JWT_SECRET_KEY, {
      expiresIn: '168h',
    });
  }
}
