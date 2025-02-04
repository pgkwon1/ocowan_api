import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamModel } from './entities/team.model';
import { TeamMemberService } from './member/member.service';
import { TeamMemberModule } from './member/member.module';
import { TeamInviteService } from './invite/invite.service';
import { TeamInviteModule } from './invite/invite.module';
import { TeamMemberModel } from './member/entities/member.model';
import { TeamInviteModel } from './invite/entities/invite.model';
import { BigthreeService } from '../bigthree/bigthree.service';
import BigThreeModel from '../bigthree/entities/bigthree.model';
import { HttpModule } from '@nestjs/axios';
import UsersModel from '../users/entities/users.model';
import { StorageModule } from '../storage/stroage.module';
import { StorageService } from '../storage/storage.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      TeamModel,
      TeamMemberModel,
      TeamInviteModel,
      BigThreeModel,
      UsersModel,
    ]),
    HttpModule.register({
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    TeamMemberModule,
    TeamInviteModule,
    StorageModule,
  ],
  providers: [
    TeamService,
    TeamInviteService,
    TeamMemberService,
    BigthreeService,
    StorageService,
  ],
  controllers: [TeamController],
})
export class TeamModule {}
