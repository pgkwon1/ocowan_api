import { UUIDV4 } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  modelName: 'ocowan',
  tableName: 'ocowan',
})
export default class OcowanModel extends Model<OcowanModel> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @Column
  readonly users_id: string;

  @Column
  readonly total_count: number;

  @Column
  readonly ocowan_date: string;
}
