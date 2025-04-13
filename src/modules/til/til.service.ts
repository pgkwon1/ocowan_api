import { forwardRef, Inject, Injectable } from '@nestjs/common';
import GenericService from 'src/common/generic.service';
import TilModel from './entities/til.model';
import { EmotifyService } from './emotify/emotify.service';
import { FindOptions } from 'sequelize';

import { CommentsService } from './comments/comments/comments.service';

@Injectable()
export class TilService extends GenericService<TilModel> {
  constructor(
    private readonly emotifyService: EmotifyService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
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
    const transactionList: Array<() => Promise<void>> = [
      async () => await super.delete(options),
      async () => await this.emotifyService.delete(otherOptions),
      async () => await this.commentsService.delete(otherOptions, foreignKey),
    ];

    return await this.executeTransaction(transactionList);
  }
}
