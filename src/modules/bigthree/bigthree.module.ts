import { Module } from '@nestjs/common';
import { BigthreeController } from './bigthree.controller';
import { BigthreeService } from './bigthree.service';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import BigThreeModel from './entities/bigthree.model';

@Module({
  imports: [
    HttpModule.register({
      headers: {
        'Content-Type': 'application/json',
      },
    }),

    SequelizeModule.forFeature([BigThreeModel]),
  ],
  controllers: [BigthreeController],
  providers: [BigthreeService],
})
export class BigthreeModule {}
