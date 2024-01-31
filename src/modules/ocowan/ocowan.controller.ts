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

@Controller('ocowan')
export class OcowanController {
  constructor(
    private readonly ocowanService: OcowanService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/check/:login')
  async check(@Param('login') login: string): Promise<boolean> {
    const now = moment(new Date()).format('YYYY-MM-DD');

    const result = await lastValueFrom(
      this.httpService.get(
        `https://api.github.com/search/commits?q=author:${login}+committer-date:${'2023-12-22'}`,
      ),
    );

    const { total_count } = result.data;
    if (!result?.data || total_count === 0) {
      return false;
    }
    return total_count;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async ocowan(
    @Body() data: OcowanFinish,
    @Jwt() login: string,
  ): Promise<boolean> {
    const { total_count } = data;
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
}
