import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import UsersService from '../users/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import UsersModel from '../users/entities/users.model';
import { JwtStrateGy } from './jwt.strategy';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel])],
  providers: [AuthService, UsersService, JwtStrateGy, RedisService],
})
export class AuthModule {}
