import { Module } from '@nestjs/common';
import { BigthreeController } from './bigthree.controller';
import { BigthreeService } from './bigthree.service';
import { SequelizeModule } from '@nestjs/sequelize';
import BigThreeModel from './entities/bigthree.model';
import UsersModel from '../users/entities/users.model';
import { UsersModule } from '../users/users.module';
import { ExternalApiModule } from '../external-api/external-api.module';

@Module({
  imports: [
    SequelizeModule.forFeature([BigThreeModel, UsersModel]),
    ExternalApiModule,
    UsersModule,
  ],
  controllers: [BigthreeController],
  providers: [BigthreeService],
  exports: [BigthreeService],
})
export class BigthreeModule {}
