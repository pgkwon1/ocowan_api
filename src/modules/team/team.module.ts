import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamModel } from './entities/team.model';
import { TeamMemberModule } from './member/member.module';
import { TeamInviteModule } from './invite/invite.module';
import { TeamMemberModel } from './member/entities/member.model';
import { TeamInviteModel } from './invite/entities/invite.model';
import BigThreeModel from '../bigthree/entities/bigthree.model';
import { HttpModule } from '@nestjs/axios';
import UsersModel from '../users/entities/users.model';
import { BigthreeModule } from '../bigthree/bigthree.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from '../storage/stroage.module';

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
    BigthreeModule,
    StorageModule,
    ConfigModule,
  ],
  providers: [TeamService],
  controllers: [TeamController],
  exports: [TeamService],
})
export class TeamModule {}
