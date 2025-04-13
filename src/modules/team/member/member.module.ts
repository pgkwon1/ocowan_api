import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamMemberModel } from './entities/member.model';
import { TeamMemberService } from './member.service';
import TeamMemberController from './member.controller';

import { TeamInviteModel } from '../invite/entities/invite.model';
import { TeamModel } from '../entities/team.model';

import { TeamModule } from '../team.module';
import { TeamInviteModule } from '../invite/invite.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TeamMemberModel, TeamInviteModel, TeamModel]),
    forwardRef(() => TeamModule),
    TeamInviteModule,
  ],
  providers: [TeamMemberService],
  controllers: [TeamMemberController],
  exports: [TeamMemberService],
})
export class TeamMemberModule {}
