import { HttpException, Injectable } from '@nestjs/common';
import { UsersRegister, UsersUpdate } from './entities/users.entity';
import { InjectModel } from '@nestjs/sequelize';
import UsersModel from './entities/users.model';
import { WhereOptions } from 'sequelize';
import LevelsService from '../levels/levels.service';
import { LevelsModel } from '../levels/entities/levels.model';

@Injectable()
export default class UsersService {
  constructor(
    @InjectModel(UsersModel) private usersModel: typeof UsersModel,
    private readonly levelsService: LevelsService,
  ) {}

  async getUser({
    login,
    github_id,
  }: {
    login: string;
    github_id: string;
  }): Promise<UsersModel> {
    const result = await this.usersModel.findOne({
      where: {
        login,
        github_id,
      },
      include: [
        {
          model: LevelsModel,
          required: false,
          attributes: ['exp', 'level'],
        },
      ],
    });
    if (result) {
      return result;
    }
    throw new HttpException('존재하지 않는 유저입니다.', 400);
  }

  async isUser(login: string, github_id: string): Promise<boolean> {
    const result = await this.usersModel.findOne({
      where: {
        login,
        github_id,
      },
    });
    if (result) {
      return true;
    }
    return false;
  }

  async register(registerData: UsersRegister): Promise<UsersModel> {
    const {
      github_id,
      login,
      avatar_url,
      bio,
      followers,
      following,
      public_repos,
      blog,
      access_token,
    } = registerData;

    const result = await this.usersModel.create({
      login,
      github_id,
      avatar_url,
      bio,
      followers,
      following,
      public_repos,
      blog,
      access_token,
    });

    await this.levelsService.create({
      users_id: result.id,
    });
    if (result === null) {
      throw new HttpException('회원가입에 실패하였습니다.', 400);
    }
    return result;
  }

  async update(
    updateData: UsersUpdate,
    where: WhereOptions<any>,
  ): Promise<boolean> {
    const [result] = await this.usersModel.update(updateData, { where });
    if (result === 0) {
      throw new HttpException('회원수정에 실패하였습니다.', 400);
    }

    return true;
  }
}
