import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import BigThreeModel from './entities/bigthree.model';
import { CreateOptions, FindOptions, Sequelize, WhereOptions } from 'sequelize';
import BaseService from 'src/common/base.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BigthreeService implements BaseService<BigThreeModel> {
  public accessToken: string;
  public login: string;
  constructor(
    @InjectModel(BigThreeModel)
    private readonly bigthreeModel: typeof BigThreeModel,

    private readonly httpService: HttpService,
  ) {}
  async create(data, options?: CreateOptions): Promise<BigThreeModel> {
    try {
      const result = await this.bigthreeModel.create(data, options);
      return result;
    } catch (error) {
      throw new HttpException('생성에 실패하였습니다.', 400);
    }
  }

  async update(data, where: WhereOptions): Promise<number> {
    try {
      const [result] = await this.bigthreeModel.update(data, {
        where,
      });
      return result;
    } catch (error) {
      throw new HttpException('업데이트에 실패하였습니다.', 400);
    }
  }

  async delete(id: string, where: WhereOptions): Promise<number> {
    try {
      const result = await this.bigthreeModel.destroy({
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException('삭제에 실패하였습니다.', 400);
    }
  }

  async getAll(options?: FindOptions): Promise<BigThreeModel[]> {
    try {
      const result = await this.bigthreeModel.findAll(options);
      return result;
    } catch (error) {
      throw new HttpException('데이터를 가져오는데 실패하였습니다.', 400);
    }
  }

  async getOne(where: FindOptions<any>): Promise<BigThreeModel> {
    try {
      where.attributes = [
        [Sequelize.fn('max', Sequelize.col('pullReqCount')), 'pullReqCount'],
        [Sequelize.fn('max', Sequelize.col('issueCount')), 'issueCount'],
        [Sequelize.fn('max', Sequelize.col('commitCount')), 'commitCount'],
      ];
      const result = await this.bigthreeModel.findOne(where);

      return result;
    } catch (error) {
      throw new HttpException('데이터를 가져오는데 실패하였습니다.', 400);
    }
  }

  async getPullCountAndIssueCount(): Promise<{
    pullReqCount: number;
    issueCount: number;
  }> {
    try {
      const query = `query {
      user(login: "${this.login}") {
        pullRequests {
          totalCount
        }
        issues {
          totalCount
        }
        
      }
    }
    `;
      const result = await lastValueFrom(
        await this.httpService.post(
          `https://api.github.com/graphql`,
          {
            query,
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        ),
      );
      const { pullRequests, issues } = result.data.data.user;
      return {
        pullReqCount: pullRequests.totalCount,
        issueCount: issues.totalCount,
      };
    } catch (error) {
      throw new HttpException('3대 측정에 실패하였습니다.', 401);
    }
  }
  async getCommitCount(): Promise<number> {
    const query = `
    query {
      user(login: "${this.login}") {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            defaultBranchRef {
              target {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }`;
    const result = await lastValueFrom(
      this.httpService.post(
        'https://api.github.com/graphql',
        {
          query,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      ),
    );
    const { nodes }: { nodes: any[] } = result.data.data.user.repositories;
    let sum = 0;
    nodes.map((branch, index) => {
      if (branch !== undefined && branch.defaultBranchRef !== null) {
        sum += branch.defaultBranchRef?.target?.history?.totalCount;
      }
    });
    return sum;
  }
}
