import { InferAttributes, UUIDV4 } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

export interface OcowanAttributes extends InferAttributes<OcowanModel> {}
export interface OcowanCreateAttr extends Omit<OcowanAttributes, 'id'> {}
@Table({
  modelName: 'ocowan',
  tableName: 'ocowan',
})
export default class OcowanModel extends Model<
  OcowanAttributes,
  OcowanCreateAttr
> {
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
