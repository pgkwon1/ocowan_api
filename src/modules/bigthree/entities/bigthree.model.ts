import { UUIDV4 } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  modelName: 'bigthree',
  tableName: 'bigthree',
})
export default class BigThreeModel extends Model<BigThreeModel> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @Column
  readonly login: string;

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
