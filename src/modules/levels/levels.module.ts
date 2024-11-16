import { Module } from '@nestjs/common';
import LevelsService from './levels.service';
import { LevelsController } from './levels.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LevelsModel } from './entities/levels.model';
import { LevelsLogsModel } from './entities/logs.model';
import LevelsLogsService from './logs.service';

@Module({
  imports: [SequelizeModule.forFeature([LevelsModel, LevelsLogsModel])],
  providers: [LevelsService, LevelsLogsService],
  controllers: [LevelsController],
  exports: [LevelsService, LevelsLogsService],
})
export class LevelsModule {}
