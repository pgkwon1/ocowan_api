import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BigthreeService } from './bigthree.service';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import { AuthGuard } from '@nestjs/passport';
import { FindOptions, Sequelize } from 'sequelize';
import UsersService from '../users/users.service';

interface MeasureBigThreeResponse {
  pullReqCount: number;
  issueCount: number;
  commitCount: number;
  isFirst: boolean;
}
@Controller('bigthrees')
export class BigthreeController {
  private readonly initialBigThree = {
    commitCount: 0,
    issueCount: 0,
    pullReqCount: 0,
  };
  constructor(
    private readonly bigthreeService: BigthreeService,
    private readonly usersService: UsersService,
  ) {}

  @Get('latest/:login')
  @UseGuards(AuthGuard('jwt'))
  async getLatestBigThree(
    @Jwt() token: JwtEntity,
    @Param('login') login: string,
  ) {
    let users_id;
    if (login) {
      users_id = (await this.usersService.findOne({ where: { login } })).id;
    } else {
      users_id = token.id;
    }
    const findOptions: FindOptions = {
      where: {
        users_id,
      },
      attributes: [
        'createdAt',
        [Sequelize.fn('max', Sequelize.col('pullReqCount')), 'pullReqCount'],
        [Sequelize.fn('max', Sequelize.col('issueCount')), 'issueCount'],
        [Sequelize.fn('max', Sequelize.col('commitCount')), 'commitCount'],
      ],
      order: [['createdAt', 'DESC']],
      group: ['createdAt'],
      limit: 7,
    };
    const result = (await this.bigthreeService.findAll(findOptions)).sort(
      () => -1,
    );
    return result;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getBigthree(@Jwt() token: JwtEntity) {
    const result = await this.bigthreeService.findOne({
      where: {
        users_id: token.id,
      },
      order: [['createdAt', 'DESC']],
    });
    if (result === null) {
      return this.initialBigThree;
    }
    return result;
  }

  @Get(':login')
  async getBigthreeByUser(@Param('login') login: string) {
    const users_id = (await this.usersService.findOne({ where: { login } })).id;

    const result = await this.bigthreeService.findAllSafe({
      where: {
        users_id,
      },
    });

    if (result === null) {
      return this.initialBigThree;
    }

    return result;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async measureAndUpdateBigThree(
    @Jwt() token: JwtEntity,
  ): Promise<MeasureBigThreeResponse> {
    const { id: users_id, login, access_token } = token;

    const { pullReqCount, issueCount } =
      await this.bigthreeService.getPullCountAndIssueCount(login, access_token);
    const commitCount = await this.bigthreeService.getCommitCount(
      login,
      access_token,
    );
    const count = await this.bigthreeService.count({
      where: {
        users_id,
      },
    });
    // 처음 측정의 경우 경험치 증가 X
    const isFirst = count === 0;

    await this.bigthreeService.create({
      users_id,
      pullReqCount,
      issueCount,
      commitCount,
    });
    return {
      pullReqCount,
      issueCount,
      commitCount,
      isFirst,
    };
  }
}
