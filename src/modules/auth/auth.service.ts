import { Injectable } from '@nestjs/common';
import UsersService from '../users/users.service';
import { GithubNotFoundException } from 'src/exception/GithubException';
import { RedisService } from '../redis/redis.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  /**
   *
   * @param payload
   *
   * @returns Promise<boolean>
   * 토큰을 decode 한 후 실제로 db에 유저가 존재하는지 검사.
   */
  async validateUser(payload): Promise<boolean> {
    const result = await this.usersService.isUser(
      payload.login,
      payload.github_id,
    );
    if (!result) {
      throw new GithubNotFoundException('Unauthorized user', 401);
    }

    return true;
  }

  /**
   *
   * @param payload
   * @returns token: from redis
   * jwt 토큰이 실제 redis에 있는지 유효성 검사.
   */
  async validateJwtToken(payload): Promise<boolean> {
    const { login } = payload;
    const result = await this.redisService.hashGetValue(
      `user:${login}`,
      'tokend',
    );
    if (result) {
      return true;
    }
    return false;
  }
}
