import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeamMemberService } from './member.service';
import { AuthGuard } from '@nestjs/passport';
import { MemberIsJoin, MemberJoin } from './entities/member.entity';
import { TeamInviteService } from '../invite/invite.service';
import * as moment from 'moment';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from 'src/modules/auth/entities/jwt.entity';

@Controller('teams/member')
export default class TeamMemberController {
  constructor(
    private readonly memberService: TeamMemberService,
    private readonly inviteService: TeamInviteService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('joinCheck/:team_id')
  async checkIsJoin(@Param() query: MemberIsJoin, @Jwt() token: JwtEntity) {
    const { team_id } = query;
    const { id } = token;
    const options = {
      where: {
        team_id,
        users_id: id,
      },
    };

    const result = await this.memberService.findOne(options);
    if (result) {
      throw new HttpException('이미 가입되어 있습니다.', 400);
    }

    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('join')
  async joinTeam(@Body() body: MemberJoin, @Jwt() token: JwtEntity) {
    const { team_id, inviteToken } = body;
    const { id: users_id } = token;
    const findData: any = {
      where: {
        team_id,
        token: inviteToken,
      },
    };

    const { expire_time, team } = await this.inviteService.findOne(findData);
    const { leader } = team;

    if (leader === users_id) {
      throw new HttpException('리더는 초대를 수락할 수 없습니다.', 400);
    }

    if (moment(expire_time).isBefore(new Date().toString())) {
      throw new HttpException('유효하지 않은 초대입니다.', 400);
    }

    const { where: createData } = findData;
    createData.users_id = users_id;
    const result = await this.memberService.create(createData);

    return result;
  }
}
