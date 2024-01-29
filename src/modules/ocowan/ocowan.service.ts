import { Injectable } from '@nestjs/common';
import { OcowanFinish } from './entities/ocowan.entity';
import OcowanModel from './entities/ocowan.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class OcowanService {
  constructor(
    @InjectModel(OcowanModel) private readonly ocowanModel: typeof OcowanModel,
  ) {}
  async create(data: OcowanFinish) {
    const result = await this.ocowanModel.create(data);
    return result;
  }

  async isOcowan(login: string, ocowan_date: string): Promise<number> {
    const result = await this.ocowanModel.count({
      where: {
        login,
        ocowan_date,
      },
    });

    return result;
  }
}
