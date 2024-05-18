import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OcowanService } from './ocowan.service';
import { HttpService } from '@nestjs/axios';
import { OcowanCheck, OcowanFinish, OcowanGet } from './entities/ocowan.entity';
import * as moment from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Jwt } from 'src/decorators/jwt.decorator';
import {
  AlreadyOcowanException,
  FailOcowanException,
} from 'src/exception/OcowanException';
import { JwtEntity } from '../auth/entities/jwt.entity';

@Controller('ocowan')
export class OcowanController {
  constructor(
    private readonly ocowanService: OcowanService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/check/:login')
  async check(
    @Param('login') login: string,
    @Jwt() token: JwtEntity,
  ): Promise<number | boolean> {
    const now = moment().format('YYYY-MM-DD');
    const query = `query{
      viewer {
        contributionsCollection(from: "${now}T00:00:00Z", to: "${now}T23:59:59Z") {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }`;
    const { data } = await lastValueFrom(
      this.httpService.post(
        'https://api.github.com/graphql',
        {
          query,
        },
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      ),
    );
    const total_count: number =
      data.data.viewer.contributionsCollection.contributionCalendar
        .totalContributions;

    if (total_count > 0) {
      return total_count;
    }

    return false;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async ocowan(
    @Body() data: OcowanFinish,
    @Jwt() token: JwtEntity,
  ): Promise<boolean> {
    const { total_count } = data;
    const { login } = token;
    const ocowan_date = moment().format('YYYY-MM-DD');

    const isOcowan = await this.ocowanService.isOcowan(login, ocowan_date);

    if (isOcowan > 0) {
      throw new AlreadyOcowanException('이미 오코완 되었습니다', 200);
    }
    const result = await this.ocowanService.create({
      login,
      ocowan_date,
      total_count,
    });
    if (!result.dataValues) {
      throw new FailOcowanException('오코완 처리 하는데 실패하였습니다.', 400);
    }
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:login')
  async getAllOcowan(@Jwt() token: JwtEntity) {
    const { id: users_id } = token;
    const result = await this.ocowanService.getAllOcowan(users_id);
    return result;
  }
}
