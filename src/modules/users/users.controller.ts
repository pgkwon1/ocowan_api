import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import UsersService from './users.service';
import { JwtUtilService } from '../auth/jwtUtil.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @Post('/login')
  async login(@Body() body) {
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
        let isRegister, result;
        const isUser = await this.usersService.isUser(
          data.login,
          data.github_id,
        );
        if (isUser) {
          //로그인
          isRegister = false;
          const { login, github_id } = data;

          await this.usersService.update(
            {
              access_token,
            },
            {
              github_id,
            },
          );
          result = await this.usersService.getUser({
            login,
            github_id,
          });
        } else {
          isRegister = true;
          data.access_token = access_token;
          result = await this.usersService.register(data);
        }

        const { id } = result;
        const token = JwtUtilService.generateJwtToken(
          data.login,
          id,
          access_token,
          data.github_id,
        );

        return {
          data,
          isRegister,
          token,
        };
      }
      return false;
    } else {
      return false;
    }
  }
}
