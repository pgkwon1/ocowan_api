import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import UsersService from './users.service';
import { JwtUtilService } from '../auth/jwtUtil.service';
import { RedisService } from '../redis/redis.service';
import { FindOptions } from 'sequelize';
import UsersModel from './entities/users.model';
import { LevelsModel } from '../levels/entities/levels.model';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  @Get('/:login')
  async getUser(@Param('login') login: string) {
    const options: FindOptions<UsersModel> = {
      where: {
        login,
      },
      include: [
        {
          model: LevelsModel,
          attributes: ['level'],
        },
      ],
    };
    const result = await this.usersService.findOne(options);
    return result;
  }
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
        const {
          login,
          avatar_url,
          github_id,
          bio,
          followers,
          following,
          public_repos,
        } = data;

        let isRegister, result;
        const option: FindOptions<UsersModel> = {
          where: {
            login: data.login,
            github_id: data.github_id,
          },
        };
        const isUser = await this.usersService.count(option);
        if (isUser > 0) {
          //로그인
          isRegister = false;

          await this.usersService.update(
            {
              access_token,
            },
            {
              login,
              github_id,
            },
          );
          (option.include = [
            {
              model: LevelsModel,
              required: false,
              attributes: ['exp', 'level'],
            },
          ]),
            (result = await this.usersService.findOne(option));
        } else {
          isRegister = true;
          data.access_token = access_token;
          result = await this.usersService.create(data);
        }

        const { id, levels } = result;
        console.log(levels);
        const token = await JwtUtilService.generateJwtToken(
          login,
          id,
          access_token,
          github_id,
        );
        data.levels = levels;
        await this.redisService.hashSetValue(`user:${data.login}`, {
          token,
        });

        return {
          data: {
            login,
            avatar_url,
            bio,
            followers,
            following,
            public_repos,
            users_id: id,
            levels,
          },
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
