import { Module } from '@nestjs/common';
import { OcowanController } from './ocowan.controller';
import { OcowanService } from './ocowan.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import OcowanModel from './entities/ocowan.model';
import LevelsService from '../levels/levels.service';
import { LevelsModel } from '../levels/entities/levels.model';
import LevelsLogsService from '../levels/logs.service';
import { LevelsLogsModel } from '../levels/entities/logs.model';

@Module({
  imports: [
    HttpModule,
    SequelizeModule.forFeature([OcowanModel, LevelsModel, LevelsLogsModel]),
  ],
  controllers: [OcowanController],
  providers: [OcowanService, LevelsService, LevelsLogsService],
})
export class OcowanModule {}
