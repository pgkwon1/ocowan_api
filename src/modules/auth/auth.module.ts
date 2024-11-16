import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import UsersService from '../users/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import UsersModel from '../users/entities/users.model';
import { JwtStrateGy } from './jwt.strategy';
import { RedisService } from '../redis/redis.service';
import { LevelsModule } from '../levels/levels.module';

@Module({
  imports: [
    /**
     * UsersService에 LevelsService를 주입받기 때문에 auth module에도 주입
     * LevelsModule을 주입하는 이유는 서비스는 모듈의 일부로서 제공되기 때문에 모듈을 통해 인스턴스를 가져올수 있게 됨
     */
    LevelsModule,
    SequelizeModule.forFeature([UsersModel]),
  ],
  providers: [AuthService, UsersService, JwtStrateGy, RedisService],
})
export class AuthModule {}
