import { Module } from '@nestjs/common';
import { TeamInviteService } from './invite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamInviteModel } from './entities/invite.model';
import InviteController from './invite/invite.controller';
import { TeamModel } from '../entities/team.model';

@Module({
  imports: [SequelizeModule.forFeature([TeamInviteModel, TeamModel])],
  providers: [TeamInviteService],
  controllers: [InviteController],
  exports: [TeamInviteService],
})
export class TeamInviteModule {}
