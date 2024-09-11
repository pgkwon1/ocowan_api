import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import UsersService from './users.service';
import UsersModel from './entities/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([UsersModel])],
  controllers: [UsersController],
  providers: [UsersService, RedisService],
})
export class UsersModule {}
