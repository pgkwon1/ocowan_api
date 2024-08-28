import { HttpException, Injectable } from '@nestjs/common';
import BaseService from 'src/common/base.service';
import { TeamModel } from './entities/team.model';
import { WhereOptions, FindOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { TeamMemberModel } from './member/entities/member.model';
import GithubModel from '../users/entities/users.model';

@Injectable()
export class TeamService implements BaseService<TeamModel> {
  constructor(
    @InjectModel(TeamModel) private readonly teamModel: typeof TeamModel,
  ) {}

  async create(data: Partial<TeamModel>): Promise<TeamModel> {
    try {
      const result = await this.teamModel.create(data);
      return result;
    } catch (e) {
      console.log(e);
      throw new HttpException('팀 생성에 실패하였습니다.', 400);
    }
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

  async delete(id: string): Promise<number> {
    const result = await this.teamModel.destroy({
      where: {
        id,
      },
    });

    if (result === 0) {
      throw new HttpException('팀 정보가 존재하지 않습니다.', 400);
    }
    return result;
  }

  async getAll(options: FindOptions<any>): Promise<TeamModel[]> {
    const result = await this.teamModel.findAll(options);
    return result;
  }

  async getOne(data: FindOptions<any>): Promise<TeamModel> {
    try {
      const result = await this.teamModel.findOne(data);
      console.log('data', data);
      return result;
    } catch (e) {
      console.log(e);
      throw new HttpException('팀 정보가 존재하지 않습니다.', 400);
    }
  }
}
