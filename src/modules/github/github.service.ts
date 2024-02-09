import { Injectable } from '@nestjs/common';
import { GithubRegister, GithubUpdate } from './entities/github.entity';
import { InjectModel } from '@nestjs/sequelize';
import GithubModel from './entities/github.model';
import {
  GithubNotFoundException,
  GithubRegisterFailException,
} from 'src/exception/GithubException';

@Injectable()
export default class GithubService {
  constructor(
    @InjectModel(GithubModel) private githubModel: typeof GithubModel,
  ) {}

  async getUser({
    login,
    github_id,
    access_token,
  }: {
    login: string;
    github_id: string;
    access_token: string;
  }): Promise<GithubModel | object> {
    const result = await this.githubModel.findOne({
      where: {
        login,
        github_id,
      },
    });
    if (result) {
      return { login: result };
    }
    throw new GithubNotFoundException('존재하지 않는 유저입니다.');
  }

  async isUser(login: string, github_id: number): Promise<boolean> {
    const result = await this.githubModel.findOne({
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

  async register(registerData: GithubRegister): Promise<boolean> {
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

    const result = await this.githubModel.create({
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
    if (result === null) {
      throw new GithubRegisterFailException('회원가입에 실패하였습니다.', 200);
    }
    return true;
  }

  async update(updateData: GithubUpdate): Promise<boolean> {
    const result = await this.githubModel.update(updateData, {
      where: {
        github_id: updateData.github_id,
      },
    });
    if (result[0] === 0) {
      return false;
    }

    return true;
  }
}
