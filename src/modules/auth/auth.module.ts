import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import UsersModel from '../users/entities/users.model';
import { JwtStrateGy } from './jwt.strategy';
import { RedisService } from '../redis/redis.service';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '@songkeys/nestjs-redis';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel]), UsersModule, RedisModule],
  providers: [AuthService, JwtStrateGy, RedisService],
})
export class AuthModule {}
