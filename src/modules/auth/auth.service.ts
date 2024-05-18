import { Injectable } from '@nestjs/common';
import UsersService from '../users/users.service';
import { GithubNotFoundException } from 'src/exception/GithubException';

@Injectable()
export default class AuthService {
  constructor(private readonly usersService: UsersService) {}
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
}
