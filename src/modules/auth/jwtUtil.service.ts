import * as jwt from 'jsonwebtoken';

export class JwtUtilService {
  constructor() {}

  static async generateJwtToken(
    login: string,
    id: string,
    access_token: string,
    github_id: string,
  ): Promise<string> {
    const token = jwt.sign(
      { login, id, access_token, github_id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '168h',
      },
    );
    return token;
  }
}
