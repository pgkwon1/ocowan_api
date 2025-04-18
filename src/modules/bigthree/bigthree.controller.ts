import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BigthreeService } from './bigthree.service';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import { AuthGuard } from '@nestjs/passport';
import { FindOptions, Sequelize } from 'sequelize';
import UsersService from '../users/users.service';
@Controller('bigthrees')
export class BigthreeController {
  constructor(
    private readonly bigthreeService: BigthreeService,
    private readonly usersService: UsersService,
  ) {}

  @Get('latest')
  @UseGuards(AuthGuard('jwt'))
  async getLatestBigThree(@Jwt() token: JwtEntity) {
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
    const result = (await this.bigthreeService.findAll(findOptions)).sort(
      () => -1,
    );
    return result;
  }

  @Get(['', ':login'])
  @UseGuards(AuthGuard('jwt'))
  async getBigthree(@Param('login') login: string, @Jwt() token: JwtEntity) {
    let users_id;
    // 들어온 라우팅에 따라 분기를 나눠 where절 설정
    if (login) {
      users_id = (await this.usersService.findOne({ where: { login } })).id;
    } else {
      users_id = token.id;
    }

    const result = await this.bigthreeService.findOne({
      where: {
        users_id,
      },
    });

    return result;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createBigthree(@Jwt() token: JwtEntity): Promise<boolean> {
    const { id: users_id, login, access_token } = token;

    const { pullReqCount, issueCount } =
      await this.bigthreeService.getPullCountAndIssueCount(login, access_token);
    const commitCount = await this.bigthreeService.getCommitCount(
      login,
      access_token,
    );

    await this.bigthreeService.create({
      users_id,
      pullReqCount,
      issueCount,
      commitCount,
    });
    return true;
  }
}
