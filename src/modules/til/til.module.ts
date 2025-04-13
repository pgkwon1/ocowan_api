import { Module } from '@nestjs/common';
import { TilService } from './til.service';
import { TilController } from './til.controller';
import { EmotifyService } from './emotify/emotify.service';
import { SequelizeModule } from '@nestjs/sequelize';
import TilModel from './entities/til.model';
import EmotifyModel from './entities/emotify.model';

import { EmotifyController } from './emotify/emotify.controller';
import { CommentsController } from './comments/comments/comments.controller';
import { CommentsService } from './comments/comments/comments.service';
import CommentsModel from './entities/comments.model';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TilModel, EmotifyModel, CommentsModel]),
    RedisModule,
  ],
  providers: [TilService, EmotifyService, CommentsService],
  controllers: [TilController, EmotifyController, CommentsController],
})
export class TilModule {}
