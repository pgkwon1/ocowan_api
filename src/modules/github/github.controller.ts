import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import GithubService from './github.service';
import { GithubLoginFailException } from 'src/exception/GithubException';

@Controller('github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly httpService: HttpService,
  ) {}

  @Post('/login')
  async login(@Body() body) {
    console.log('accesss');

    const result = await lastValueFrom(
      this.httpService.post(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET_ID}&code=${body.code}`,
        {},
        {
          headers: {
            Accept: 'application/json',
          },
        },
      ),
    );

    if ('access_token' in result.data) {
      const { access_token } = result.data;
      const userResult = await lastValueFrom(
        this.httpService.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${access_token}`,
          },
        }),
      );
      const { status, data } = userResult;
      if (status === 200 && data.login !== '') {
        data.github_id = data.id;
        const isUser = await this.githubService.isUser(
          data.login,
          data.github_id,
        );
        if (isUser) {
          //로그인
          const { login, github_id } = data;

          await this.githubService.update({
            github_id,
            access_token,
          });
          return this.githubService.getUser({ login, github_id, access_token });
        } else {
          data.access_token = access_token;
          return this.githubService.register(data);
        }
      }
      return false;
    } else {
      return false;
    }
  }
}
