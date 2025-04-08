import { Module } from '@nestjs/common';
import { BigthreeController } from './bigthree.controller';
import { BigthreeService } from './bigthree.service';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import BigThreeModel from './entities/bigthree.model';
import UsersModel from '../users/entities/users.model';
import UsersService from '../users/users.service';

@Module({
  imports: [
    HttpModule.register({
      headers: {
        'Content-Type': 'application/json',
      },
    }),

    SequelizeModule.forFeature([BigThreeModel, UsersModel]),
  ],
  controllers: [BigthreeController],
  providers: [BigthreeService, UsersService],
})
export class BigthreeModule {}
