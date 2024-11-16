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

@Module({
  imports: [
    HttpModule,
    LevelsModule,
    SequelizeModule.forFeature([UsersModel, LevelsModel]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RedisService, UsersService, LevelsService],
})
export class UsersModule {}
