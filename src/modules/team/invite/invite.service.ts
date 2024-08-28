import { HttpException, Injectable } from '@nestjs/common';
import BaseService from 'src/common/base.service';
import { TeamInviteModel } from './entities/invite.model';
import { WhereOptions, FindOptions, Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { TeamModel } from '../entities/team.model';

@Injectable()
export class TeamInviteService implements BaseService<TeamInviteModel> {
  constructor(
    @InjectModel(TeamInviteModel)
    private readonly teamInviteModel: typeof TeamInviteModel,
    @InjectModel(TeamModel)
    private readonly teamModel: typeof TeamModel,
  ) {}
  async create(data: Partial<TeamInviteModel>): Promise<TeamInviteModel> {
    const result = await this.teamInviteModel.create(data);
    if (result.id) {
      result.token = btoa(result.id);
      result.save();
    }
    return result;
  }

  async update?(
    data: Partial<TeamInviteModel>,
    where: WhereOptions,
  ): Promise<number> {
    const [result] = await this.teamInviteModel.update(data, {
      where,
    });
    if (result === 0) {
      throw new HttpException('업데이트에 실패하였습니다.', 500);
    }
    return result;
  }

  async delete(id: string, where: WhereOptions): Promise<number> {
    const result = await this.teamInviteModel.destroy({
      where,
    });
    if (result === 0) {
      throw new HttpException('삭제에 실패하였습니다.', 500);
    }
    return result;
  }
  async getAll(options: FindOptions<any>): Promise<TeamInviteModel[]> {
    options.where = {
      expire_time: {
        [Op.lt]: '2018-10-20',
      },
    };
    const result = await this.teamInviteModel.findAll(options);
    return result;
  }
  async getOne(options: FindOptions<any>): Promise<TeamInviteModel> {
    const where = options;
    where.include = [{ model: TeamModel, as: 'team' }];
    const result = await this.teamInviteModel.findOne(where);
    return result;
  }
}
