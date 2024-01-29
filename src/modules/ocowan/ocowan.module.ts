import { Module } from '@nestjs/common';
import { OcowanController } from './ocowan.controller';
import { OcowanService } from './ocowan.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import OcowanModel from './entities/ocowan.model';

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([OcowanModel])],
  controllers: [OcowanController],
  providers: [OcowanService],
})
export class OcowanModule {}
