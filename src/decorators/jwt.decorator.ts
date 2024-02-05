import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const Jwt = createParamDecorator(
  async (data, context: ExecutionContext) => {
    const { headers } = context.switchToHttp().getRequest();
    const tokens = headers.authorization.split(' ')[1];
    const decodeTokens = await decodeJwt(tokens);
    if (typeof decodeTokens === 'object') {
      return {
        login: decodeTokens.login,
        access_token: decodeTokens.access_token,
      };
    }

    throw new BadRequestException('invalid token');
  },
);

function decodeJwt(token: string): Promise<string | jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      if (error) reject(error);

      resolve(decoded);
    });
  });
}
