import { Injectable } from '@nestjs/common';
import GenericService from 'src/common/generic.service';
import TilModel from './entities/til.model';
import { FindOptions } from 'sequelize';

import CommentsModel from './entities/comments.model';
import { InjectModel } from '@nestjs/sequelize';
import EmotifyModel from './entities/emotify.model';

@Injectable()
export class TilService extends GenericService<TilModel> {
  constructor(
    @InjectModel(CommentsModel)
    private readonly commentsModel: typeof CommentsModel,
    @InjectModel(EmotifyModel)
    private readonly emotifyModel: typeof EmotifyModel,
  ) {
    super(TilModel);
  }

  /**
   *
   * 오버로딩
   */
  async delete(options: FindOptions<TilModel>): Promise<void>;
  async delete(
    options: FindOptions<TilModel>,
    foreignKey: string,
  ): Promise<void>;

  async delete(options: FindOptions<TilModel>, foreignKey?: string) {
    const otherOptions = {
      where: {
        til_id: foreignKey,
      },
    };

    /**
     *
     * 트랜잭션 실행 중 트랜잭션 중복 실행(comments 삭제 처리할 때)을 막기 위해 별도의 메소드에서 삭제 처리.
     */
    const transactionList: Array<() => Promise<void>> = [
      async () => await super.delete(options),
      async () => await this.emotifyDelete(otherOptions),
      async () => await this.commentsDelete(otherOptions),
    ];

    return await this.executeTransaction(transactionList);
  }

  async emotifyDelete(options: FindOptions) {
    await this.emotifyModel.destroy(options);
  }

  async commentsDelete(options: FindOptions) {
    await this.commentsModel.destroy(options);
  }
}
