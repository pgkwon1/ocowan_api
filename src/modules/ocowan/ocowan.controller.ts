import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OcowanService } from './ocowan.service';
import { HttpService } from '@nestjs/axios';
import { OcowanFinish } from './entities/ocowan.entity';
import * as moment from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import LevelsService from '../levels/levels.service';
import { Sequelize } from 'sequelize-typescript';
import { FindOptions, Op } from 'sequelize';

@Controller('ocowan')
export class OcowanController {
  constructor(
    private readonly ocowanService: OcowanService,
    private readonly httpService: HttpService,
    private readonly levelsService: LevelsService,
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
    const { id: users_id } = token;
    const ocowan_date = moment().format('YYYY-MM-DD');

    const isOcowan = await this.ocowanService.count({
      where: {
        users_id,
        ocowan_date,
      },
    });

    if (isOcowan > 0) {
      throw new HttpException('이미 오코완 되었습니다', 400);
    }

    const result = await this.ocowanService.create({
      ocowan_date,
      users_id,
      total_count,
    });

    if (!result.dataValues) {
      throw new HttpException('오코완 처리 하는데 실패하였습니다.', 400);
    }
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:login')
  async getAllOcowan(@Jwt() token: JwtEntity) {
    const { id: users_id } = token;
    const startDay = moment().startOf('month').format('YYYY-MM-DD');
    const endDay = moment().endOf('month').format('YYYY-MM-DD');
    const findOptions: FindOptions = {
      attributes: [
        'ocowan_date',
        [Sequelize.literal('ANY_VALUE(total_count)'), 'total_count'],
      ],
      raw: true,
      where: {
        users_id,
        ocowan_date: {
          [Op.between]: [startDay, endDay],
        },
      },

      group: ['ocowan_date'],
    };

    const result = await this.ocowanService.findAll(findOptions);
    return result;
  }
}
