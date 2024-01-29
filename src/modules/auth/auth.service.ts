import { Injectable } from '@nestjs/common';
import GithubService from '../github/github.service';
import { GithubNotFoundException } from 'src/exception/GithubException';

@Injectable()
export default class AuthService {
  constructor(private readonly githubService: GithubService) {}
  async validateUser(payload): Promise<boolean> {
    const result = await this.githubService.isUser(
      payload.login,
      payload.github_id,
    );
    if (!result) {
      throw new GithubNotFoundException('Unauthorized user', 401);
    }

    return true;
  }
}
