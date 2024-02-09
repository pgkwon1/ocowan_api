import * as jwt from 'jsonwebtoken';

export class JwtUtilService {
  constructor() {}

  static generateJwtToken(
    login: string,
    github_id: number,
    access_token: string,
  ): string {
    return jwt.sign(
      { login, github_id, access_token },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '48h',
      },
    );
  }
}
