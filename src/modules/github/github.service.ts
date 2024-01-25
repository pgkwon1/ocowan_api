import { Injectable } from '@nestjs/common';
import { GithubRegister } from './entities/github.entity';
import { InjectModel } from '@nestjs/sequelize';
import GithubModel from './entities/github.model';
import {
  GithubNotFoundException,
  GithubRegisterFailException,
} from 'src/exception/GithubException';
import * as jwt from 'jsonwebtoken';

@Injectable()
export default class GithubService {
  constructor(
    @InjectModel(GithubModel) private githubModel: typeof GithubModel,
  ) {}

  async getUser(
    login: string,
    github_id: number,
  ): Promise<GithubModel | object> {
    const result = await this.githubModel.findOne({
      where: {
        login,
        github_id,
      },
    });
    if (result) {
      const token = GithubService.generateJwtToken(
        result.login,
        result.github_id,
      );
      return { login: result, token };
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
    });
    if (result === null) {
      throw new GithubRegisterFailException('회원가입에 실패하였습니다.', 200);
    }
    return true;
  }

  static generateJwtToken(login: string, github_id: number): string {
    return jwt.sign({ login, github_id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '48h',
    });
  }
}
