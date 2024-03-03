import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BigthreeService } from './bigthree.service';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import { AuthGuard } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { FindOptions, Op, Sequelize } from 'sequelize';
import * as moment from 'moment-timezone';
@Controller('bigthrees')
export class BigthreeController {
  constructor(
    private readonly bigthreeService: BigthreeService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getBigthree(@Jwt() token: JwtEntity) {
    const { login } = token;
    const result = await this.bigthreeService.getOne({ login });

    return result;
  }

  @Get('weekly')
  @UseGuards(AuthGuard('jwt'))
  async getWeekly(@Jwt() token: JwtEntity) {
    const { login } = token;
    const findOptions: FindOptions = {
      where: {
        login,
      },
      attributes: [
        'createdAt',
        [Sequelize.literal('ANY_VALUE(updatedAt)'), 'updatedAt'],
        [Sequelize.literal('ANY_VALUE(login)'), 'login'],

        [Sequelize.fn('max', Sequelize.col('pullReqCount')), 'pullReqCount'],
        [Sequelize.fn('max', Sequelize.col('issueCount')), 'issueCount'],
        [Sequelize.fn('max', Sequelize.col('commitCount')), 'commitCount'],
      ],
      order: [['createdAt', 'DESC']],
      group: ['createdAt'],
      limit: 7,
    };
    const result = await this.bigthreeService.getAll(findOptions);
    const orderData = result.sort(() => 1);
    console.log(orderData);
    return orderData;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createBigthree(@Jwt() token: JwtEntity): Promise<boolean> {
    const { login, access_token } = token;
    this.bigthreeService.login = login;
    this.bigthreeService.accessToken = access_token;

    const { pullReqCount, issueCount } =
      await this.bigthreeService.getPullCountAndIssueCount();
    const commitCount = await this.bigthreeService.getCommitCount();

    await this.bigthreeService.create({
      login,
      pullReqCount,
      issueCount,
      commitCount,
    });
    return true;
  }
}
