import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { TeamService } from './team.service';
import { AuthGuard } from '@nestjs/passport';
import { FindOptions, Sequelize } from 'sequelize';
import { TeamMemberService } from './member/member.service';
import { BigthreeService } from '../bigthree/bigthree.service';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import { TeamModel } from './entities/team.model';
import * as moment from 'moment-timezone';

import UsersModel from '../users/entities/users.model';
import { TeamMemberModel } from './member/entities/member.model';
import * as fs from 'fs/promises';
import { CustomFileDecorator } from 'src/decorators/file.decorator';
import { StorageService } from '../storage/storage.service';

@Controller('teams')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService,
    private readonly bigThreeService: BigthreeService,
    private readonly storageService: StorageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/info/:id')
  async getTeamInfo(@Param('id') id: string) {
    const result = await this.teamService.findOne({
      where: {
        id,
      },
      include: [
        {
          model: TeamMemberModel,
          include: [
            {
              model: UsersModel,
              attributes: ['login', 'avatar_url'],
            },
          ],
        },
      ],
    });

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list/:page')
  async getTeamList(@Jwt() token: JwtEntity, @Param('page') page: number) {
    let offset = 0;

    if (page > 1) {
      offset = 10 * (page - 1);
    }
    const { id } = token;

    const findOption: FindOptions<any> = {
      limit: 10,
      offset,
      where: {
        users_id: id,
      },
      attributes: ['team_id'],
      include: [
        {
          model: TeamModel,
        },
      ],
    };

    const { rows, count } =
      await this.teamMemberService.findAndCountAll(findOption);
    const teamList = count > 0 ? rows.map((data) => data.team) : [];
    return {
      teamList,
      count,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('bigthree/:id')
  async getMemberBigthree(@Param('id') team_id: string) {
    const findOption: FindOptions = {
      attributes: ['users_id'],
      where: {
        team_id,
      },
    };

    const teamMember = await this.teamMemberService.findAll(findOption);
    const bigThreeFindOptions: FindOptions = {
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
    const bigThreeArr = Promise.all(
      teamMember.map(async (member) => {
        const { users_id } = member;
        bigThreeFindOptions.where = {
          users_id,
        };
        return await this.bigThreeService.findAll(bigThreeFindOptions);
      }),
    );

    return bigThreeArr;
  }

  @UseGuards(AuthGuard('jwt'))
  @CustomFileDecorator({ fieldName: 'teamLogo', destination: 'upload/team' })
  @Post('/create')
  async createTeam(
    @UploadedFile() file: Express.Multer.File,
    @Body() data,
    @Jwt() token: JwtEntity,
  ) {
    const { id: users_id } = token;
    const buffer = await fs.readFile(file.path);
    const { url } = await this.storageService.upload({
      path: file.path,
      buffer,
    });
    data.logo = url;

    const result = await this.teamService.create(data);

    /* 팀 멤버(본인) 생성 */
    await this.teamMemberService.create({
      team_id: result.id,
      users_id,
      leader_yn: true,
      join_date: moment().format('YYYY-MM-DD'),
    });
    fs.unlink(file.path);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit')
  @CustomFileDecorator({ fieldName: 'teamLogo', destination: 'upload/team' })
  async editTeam(@UploadedFile() file: Express.Multer.File, @Body() data) {
    const { id, name, description } = data;
    const buffer = await fs.readFile(file.path);
    const { url } = await this.storageService.upload({
      path: file.path,
      buffer,
    });
    const updateData = {
      logo: url,
      name,
      description,
    };
    const where = {
      id,
    };
    const result = await this.teamService.update(updateData, where);
    fs.unlink(file.path);

    return result;
  }
}
