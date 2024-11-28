import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { TeamService } from './team.service';
import { AuthGuard } from '@nestjs/passport';
import { FindOptions, Sequelize } from 'sequelize';
import { TeamMemberService } from './member/member.service';
import { BigthreeService } from '../bigthree/bigthree.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { imageFileFilter } from 'src/utils/file.filter';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import { TeamModel } from './entities/team.model';
import * as moment from 'moment-timezone';
import { AzureService } from '../azure/azure.service';
import { v4 as uuidv4 } from 'uuid';
import UsersModel from '../users/entities/users.model';
import { TeamMemberModel } from './member/entities/member.model';
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
    const result = await this.teamService.getOne({
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
      await this.teamMemberService.getAllAndCount(findOption);
    const teamList = count > 0 && rows.map((data) => data.team);
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

    const teamMember = await this.teamMemberService.getAll(findOption);
    const bigThreeFindOptions: FindOptions = {
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
    const bigThreeArr = Promise.all(
      teamMember.map(async (member) => {
        const { users_id } = member;
        bigThreeFindOptions.where = {
          users_id,
        };
        return await this.bigThreeService.getAll(bigThreeFindOptions);
      }),
    );

    return bigThreeArr;
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('logo', {
      fileFilter: imageFileFilter,
      storage: memoryStorage(),
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createTeam(
    @UploadedFile() file: Express.Multer.File,
    @Body() data,
    @Jwt() token: JwtEntity,
  ) {
    const { id: users_id } = token;
    file.originalname = `${uuidv4()}-${file.originalname}`;

    data.logo = (await this.storageService.upload(file)).url;

    const result = await this.teamService.create(data);

    await this.teamMemberService.create({
      team_id: result.id,
      users_id,
      join_date: moment().format('YYYY-mm-dd'),
    });
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('logo', {
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: 'uploads/logo ',
        filename: (req, file: Express.Multer.File, callback) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          file.originalname = btoa(file.originalname);
          const filename = `${unique}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit')
  async editTeam(@UploadedFile() file: Express.Multer.File, @Body() data) {
    const { id, name, description } = data;
    const updateData = {
      logo: file ? file.filename : data.logo,
      name,
      description,
    };
    const where = {
      id,
    };
    const result = await this.teamService.update(updateData, where);
    return result;
  }
}
