import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import UsersService from './users.service';
import UsersModel from './entities/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisService } from '../redis/redis.service';
import LevelsService from '../levels/levels.service';
import { LevelsModel } from '../levels/entities/levels.model';
import { LevelsModule } from '../levels/levels.module';
import TilModel from '../til/entities/til.model';
import OcowanModel from '../ocowan/entities/ocowan.model';
import BigThreeModel from '../bigthree/entities/bigthree.model';

@Module({
  imports: [
    HttpModule,
    LevelsModule,
    SequelizeModule.forFeature([
      UsersModel,
      LevelsModel,
      TilModel,
      OcowanModel,
      BigThreeModel,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RedisService, UsersService, LevelsService],
})
export class UsersModule {}
