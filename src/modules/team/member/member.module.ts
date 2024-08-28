import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamMemberModel } from './entities/member.model';
import { TeamMemberService } from './member.service';
import TeamMemberController from './member.controller';
import { TeamInviteService } from '../invite/invite.service';
import { TeamInviteModel } from '../invite/entities/invite.model';
import { TeamModel } from '../entities/team.model';
import { TeamService } from '../team.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TeamMemberModel, TeamInviteModel, TeamModel]),
  ],
  providers: [TeamInviteService, TeamMemberService, TeamService],
  controllers: [TeamMemberController],
})
export class TeamMemberModule {}
