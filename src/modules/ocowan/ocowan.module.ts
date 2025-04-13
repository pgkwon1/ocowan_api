import { Module } from '@nestjs/common';
import { OcowanController } from './ocowan.controller';
import { OcowanService } from './ocowan.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import OcowanModel from './entities/ocowan.model';
import { LevelsModel } from '../levels/entities/levels.model';
import { LevelsLogsModel } from '../levels/entities/logs.model';
import { LevelsModule } from '../levels/levels.module';

@Module({
  imports: [
    HttpModule,
    SequelizeModule.forFeature([OcowanModel, LevelsModel, LevelsLogsModel]),
    LevelsModule,
  ],
  controllers: [OcowanController],
  providers: [OcowanService],
})
export class OcowanModule {}
