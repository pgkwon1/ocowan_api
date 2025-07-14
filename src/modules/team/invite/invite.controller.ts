import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TeamInviteService } from './invite.service';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment-timezone';
import { TeamModel } from '../entities/team.model';

@Controller('invites')
export default class InviteController {
  constructor(private readonly teamInvite: TeamInviteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/team/:token')
  async getInvite(@Param('token') token: string) {
    const result = await this.teamInvite.findOne({
      where: {
        token,
      },
      include: [
        {
          model: TeamModel,
          attributes: ['id', 'name', 'description', 'leader', 'member_count'],
        },
      ],
    });

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/createCode')
  async createInviteCode(@Body() body: { teamId: string }) {
    const { teamId } = body;
    const expire_time = moment()
      .tz('Asia/Seoul')
      .add(10, 'minutes')
      .format('YYYY-MM-DD H:mm:s');
    const inviteData = {
      team_id: teamId,
      expire_time,
    };
    const result = await this.teamInvite.create(inviteData);
    return result;
  }
}
