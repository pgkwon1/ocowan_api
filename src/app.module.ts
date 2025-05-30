import { Logger, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import UsersModel from './modules/users/entities/users.model';
import * as dotenv from 'dotenv';
import { OcowanModule } from './modules/ocowan/ocowan.module';
import { LoggerModule } from './modules/winston/winston.module';
import OcowanModel from './modules/ocowan/entities/ocowan.model';
import { BigthreeModule } from './modules/bigthree/bigthree.module';
import BigThreeModel from './modules/bigthree/entities/bigthree.model';
import { TeamModel } from './modules/team/entities/team.model';
import { TeamMemberModel } from './modules/team/member/entities/member.model';
import { TeamInviteModel } from './modules/team/invite/entities/invite.model';
import { TeamModule } from './modules/team/team.module';
import { TeamMemberModule } from './modules/team/member/member.module';
import { TeamInviteModule } from './modules/team/invite/invite.module';
import { AzureModule } from './modules/azure/azure.module';
import { RedisModule } from '@songkeys/nestjs-redis';
import { LevelsModel } from './modules/levels/entities/levels.model';
import { LevelsModule } from './modules/levels/levels.module';
import { LevelsLogsModel } from './modules/levels/entities/logs.model';
import { TilModule } from './modules/til/til.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './modules/storage/stroage.module';
import TilModel from './modules/til/entities/til.model';
import EmotifyModel from './modules/til/entities/emotify.model';
import CommentsModel from './modules/til/entities/comments.model';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter, TypeErrorFilter } from './common/common.catch';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ExternalApiModule } from './modules/external-api/external-api.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      port: 3306,
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      timezone: '+09:00',

      models: [
        UsersModel,
        OcowanModel,
        BigThreeModel,
        TeamModel,
        TeamMemberModel,
        TeamInviteModel,
        LevelsModel,
        LevelsLogsModel,
        TilModel,
        EmotifyModel,
        CommentsModel,
      ],
    }),

    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),

    UsersModule,
    AuthModule,
    OcowanModule,
    BigthreeModule,
    LoggerModule,
    TeamModule,
    LevelsModule,

    TeamInviteModule,
    TeamMemberModule,
    RedisModule,
    TilModule,
    StorageModule,
    ExternalApiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    Logger,
  ],
})
export class AppModule {}
