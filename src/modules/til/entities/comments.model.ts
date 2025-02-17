import { DataTypes, UUIDV4 } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import UsersModel from 'src/modules/users/entities/users.model';
import TilModel from './til.model';

export interface CreationComments {
  til_id: string;
  users_id: string;
  contents: string;
}

@Table({
  tableName: 'comments',
  modelName: 'comments',
  timestamps: true,
})
export default class CommentsModel extends Model<
  CommentsModel,
  CreationComments
> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @ForeignKey(() => TilModel)
  @Column
  readonly til_id: string;

  @ForeignKey(() => UsersModel)
  @Column
  readonly users_id: string;

  @Column
  readonly contents: string;

  @BelongsTo(() => UsersModel, 'users_id')
  readonly users: UsersModel;

  @BelongsTo(() => TilModel, 'til_id')
  readonly til: TilModel;
}
