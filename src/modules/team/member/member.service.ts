import { Injectable } from '@nestjs/common';
import BaseService from 'src/common/base.service';
import { TeamMemberModel } from './entities/member.model';
import { WhereOptions, FindOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TeamMemberService implements BaseService<TeamMemberModel> {
  constructor(
    @InjectModel(TeamMemberModel)
    private readonly teamMemberModel: typeof TeamMemberModel,
  ) {}

  async create(data: Partial<TeamMemberModel>): Promise<TeamMemberModel> {
    const result = await this.teamMemberModel.create(data);
    return result;
  }

  async update?(
    data: Partial<TeamMemberModel>,
    where: WhereOptions,
  ): Promise<number> {
    const [result] = await this.teamMemberModel.update(data, {
      where,
    });
    return result;
  }

  async delete(id: string): Promise<number> {
    const result = await this.teamMemberModel.destroy({
      where: {
        id,
      },
    });
    return result;
  }

  async getAll(options: FindOptions<any>): Promise<TeamMemberModel[]> {
    const result = await this.teamMemberModel.findAll(options);
    return result;
  }

  async getOne(options: Partial<any>): Promise<TeamMemberModel> {
    const result = await this.teamMemberModel.findOne({
      where: options,
    });
    return result;
  }

  async getAllAndCount(
    options: FindOptions<any>,
  ): Promise<{ rows: TeamMemberModel[]; count: number }> {
    const { rows, count } = await this.teamMemberModel.findAndCountAll(options);
    return {
      rows,
      count,
    };
  }
}
