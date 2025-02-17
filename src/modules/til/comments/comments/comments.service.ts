import { forwardRef, Inject, Injectable } from '@nestjs/common';
import GenericService from 'src/common/generic.service';
import CommentsModel, { CreationComments } from '../../entities/comments.model';
import { TilService } from '../../til.service';
import { FindOptions } from 'sequelize';

@Injectable()
export class CommentsService extends GenericService<CommentsModel> {
  constructor(
    @Inject(forwardRef(() => TilService))
    private readonly tilService: TilService,
  ) {
    super(CommentsModel);
  }
  async create(data: CreationComments): Promise<CommentsModel> {
    const transaction = [
      async () => await super.create(data),
      async () => {
        await this.tilService.increment(
          {
            commentsCnt: 1,
          },
          {
            id: data.til_id,
          },
        );
        return true;
      },
    ];
    return await this.executeTransaction(transaction)[0];
  }

  async delete(options: FindOptions<CommentsModel>): Promise<void>;
  async delete(
    options: FindOptions<CommentsModel>,
    til_id: string,
  ): Promise<void>;

  async delete(
    options: FindOptions<CommentsModel>,
    til_id?: string,
  ): Promise<void> {
    const transactionList = [
      async () => await super.delete(options),
      async () => {
        await this.tilService.decrement(
          { commentsCnt: 1 },
          {
            id: til_id,
          },
        );
        return true;
      },
    ];

    await this.executeTransaction(transactionList);
  }
}
