import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './modules/github/github.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import GithubModel from './modules/github/entities/github.model';
import * as dotenv from 'dotenv';
import { OcowanModule } from './modules/ocowan/ocowan.module';
import { LoggerModule } from './modules/winston/winston.module';
import OcowanModel from './modules/ocowan/entities/ocowan.model';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      port: 3306,
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      models: [GithubModel, OcowanModel],
    }),
    GithubModule,
    AuthModule,
    OcowanModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
