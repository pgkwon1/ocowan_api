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
      const { login, access_token, github_id, id } = decodeTokens;

      return {
        login,
        access_token,
        github_id,
        id,
      };
    }

    throw new BadRequestException('invalid token');
  },
);

function decodeJwt(
  token: string,
  throwException = true,
): Promise<string | jwt.JwtPayload> {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      if (error && throwException)
        throw new BadRequestException('invalid token');
      resolve(decoded);
    });
  });
}

export const OptionalJwt = createParamDecorator(
  async (data, context: ExecutionContext) => {
    const { headers } = context.switchToHttp().getRequest();
    const tokens = headers.authorization.split(' ')[1];
    //예외 발생 여부.
    const throwException = false;
    const decodeTokens = await decodeJwt(tokens, throwException);
    if (typeof decodeTokens === 'object') {
      const { login, access_token, github_id, id } = decodeTokens;

      return {
        login,
        access_token,
        github_id,
        id,
      };
    }

    return undefined;
  },
);
