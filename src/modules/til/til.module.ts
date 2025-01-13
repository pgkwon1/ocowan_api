import { Module } from '@nestjs/common';
import { TilService } from './til.service';
import { TilController } from './til.controller';
import { EmotifyService } from './emotify/emotify.service';
import { SequelizeModule } from '@nestjs/sequelize';
import TilModel from './entities/til.model';
import EmotifyModel from './entities/emotify.model';
import { RedisService } from '../redis/redis.service';
import { EmotifyController } from './emotify/emotify.controller';

@Module({
  imports: [SequelizeModule.forFeature([TilModel, EmotifyModel])],
  providers: [TilService, EmotifyService, RedisService],
  controllers: [TilController, EmotifyController],
})
export class TilModule {}
