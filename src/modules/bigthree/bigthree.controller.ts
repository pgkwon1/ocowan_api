import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BigthreeService } from './bigthree.service';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import { AuthGuard } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { FindOptions, Sequelize } from 'sequelize';
@Controller('bigthrees')
export class BigthreeController {
  constructor(
    private readonly bigthreeService: BigthreeService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getBigthree(@Jwt() token: JwtEntity) {
    const { id: users_id } = token;
    const result = await this.bigthreeService.getOne({
      where: {
        users_id,
      },
    });

    return result;
  }

  @Get('weekly')
  @UseGuards(AuthGuard('jwt'))
  async getWeekly(@Jwt() token: JwtEntity) {
    const { id: users_id } = token;
    const findOptions: FindOptions = {
      where: {
        users_id,
      },
      attributes: [
        'createdAt',
        [Sequelize.literal('ANY_VALUE(updatedAt)'), 'updatedAt'],
        [Sequelize.literal('ANY_VALUE(users_id)'), 'users_id'],

        [Sequelize.fn('max', Sequelize.col('pullReqCount')), 'pullReqCount'],
        [Sequelize.fn('max', Sequelize.col('issueCount')), 'issueCount'],
        [Sequelize.fn('max', Sequelize.col('commitCount')), 'commitCount'],
      ],
      order: [['createdAt', 'DESC']],
      group: ['createdAt'],
      limit: 7,
    };
    const result = (await this.bigthreeService.getAll(findOptions)).sort(
      () => -1,
    );
    return result;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createBigthree(@Jwt() token: JwtEntity): Promise<boolean> {
    const { id: users_id, login, access_token } = token;
    this.bigthreeService.login = login;
    this.bigthreeService.accessToken = access_token;

    const { pullReqCount, issueCount } =
      await this.bigthreeService.getPullCountAndIssueCount();
    const commitCount = await this.bigthreeService.getCommitCount();

    await this.bigthreeService.create({
      login,
      users_id,
      pullReqCount,
      issueCount,
      commitCount,
    });
    return true;
  }
}
