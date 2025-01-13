import { HttpException, Injectable } from '@nestjs/common';
import { OcowanFinish } from './entities/ocowan.entity';
import OcowanModel from './entities/ocowan.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import * as moment from 'moment';

@Injectable()
export class OcowanService {
  constructor(
    @InjectModel(OcowanModel) private readonly ocowanModel: typeof OcowanModel,
  ) {}
  async create(data: OcowanFinish) {
    const result = await this.ocowanModel.create(data);

    if (!result) {
      throw new HttpException('오코완 처리에 실패하였습니다.', 400);
    }
    return result;
  }

  async isOcowan(users_id: string, ocowan_date: string): Promise<number> {
    const result = await this.ocowanModel.count({
      where: {
        users_id,
        ocowan_date,
      },
    });

    return result;
  }

  async getAllOcowan(users_id: string): Promise<OcowanModel[]> {
    const startDay = moment().startOf('month').format('YYYY-MM-DD');
    const endDay = moment().endOf('month').format('YYYY-MM-DD');
    const result = await this.ocowanModel.findAll({
      attributes: [
        'ocowan_date',
        [Sequelize.literal('ANY_VALUE(total_count)'), 'total_count'],
      ],
      raw: true,
      where: {
        users_id,
        ocowan_date: {
          [Op.between]: [startDay, endDay],
        },
      },

      group: ['ocowan_date'],
    });

    return result;
  }
}
