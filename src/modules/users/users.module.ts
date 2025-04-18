import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import UsersService from './users.service';
import UsersModel from './entities/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { LevelsModel } from '../levels/entities/levels.model';
import { LevelsModule } from '../levels/levels.module';
import TilModel from '../til/entities/til.model';
import OcowanModel from '../ocowan/entities/ocowan.model';
import BigThreeModel from '../bigthree/entities/bigthree.model';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UsersModel,
      LevelsModel,
      TilModel,
      OcowanModel,
      BigThreeModel,
    ]),
    HttpModule,
    LevelsModule,
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
