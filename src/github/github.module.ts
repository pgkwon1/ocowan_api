import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { HttpModule } from '@nestjs/axios';
import GithubService from './github.service';
import GithubModel from './entities/github.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([GithubModel])],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
