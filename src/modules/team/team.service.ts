import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import BaseService from 'src/common/base.service';
import { TeamModel } from './entities/team.model';
import { WhereOptions, FindOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TeamService implements BaseService<TeamModel> {
  constructor(
    @InjectModel(TeamModel) private readonly teamModel: typeof TeamModel,
  ) {}

  async create(data: Partial<TeamModel>): Promise<TeamModel> {
    const result = await this.teamModel.create(data);
    return result;
    throw new Error('Method not implemented.');
  }

  async update?(
    data: Partial<TeamModel>,
    where: WhereOptions,
  ): Promise<number> {
    const [result] = await this.teamModel.update(data, {
      where,
    });

    if (result === 0) {
      throw new HttpException('업데이트에 실패하였습니다.', 400);
    }
    return result;
  }

  async delete(id: string, where: WhereOptions): Promise<number> {
    const result = await this.teamModel.destroy({
      where: {
        id,
      },
    });
    return result;

    throw new Error('Method not implemented.');
  }

  async getAll(options: FindOptions<any>): Promise<TeamModel[]> {
    const result = await this.teamModel.findAll(options);
    return result;
    throw new Error('Method not implemented.');
  }

  async getOne(data: Partial<TeamModel>): Promise<TeamModel> {
    const result = await this.teamModel.findOne({
      where: data,
    });

    if (result === null) {
      throw new NotFoundException('팀 정보가 존재하지 않습니다.');
    }
    return result;
  }
}
