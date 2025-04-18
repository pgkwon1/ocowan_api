import { InferAttributes, UUIDV4 } from 'sequelize';
import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import UsersModel from 'src/modules/users/entities/users.model';

interface BigThreeAttributes extends InferAttributes<BigThreeModel> {}
interface BigThreeCreationAttr extends Omit<BigThreeAttributes, 'id'> {}
@Table({
  modelName: 'bigthree',
  tableName: 'bigthree',
})
export default class BigThreeModel extends Model<
  BigThreeModel,
  BigThreeCreationAttr
> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @ForeignKey(() => UsersModel)
  @Column
  readonly users_id: string;

  @Column({
    defaultValue: 0,
  })
  readonly issueCount: number;

  @Column({
    defaultValue: 0,
  })
  readonly pullReqCount: number;

  @Column({
    defaultValue: 0,
  })
  readonly commitCount: number;

  @Column
  readonly createdAt?: Date;

  @Column
  readonly updatedAt?: Date;
}
