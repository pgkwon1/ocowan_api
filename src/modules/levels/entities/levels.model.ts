import { UUIDV4 } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

interface LevelsModelAttribute {
  id: string;
  users_id: string;
  exp: number;
  level: number;
}
export interface LevelsCreateAttribute {
  users_id: string;
}
@Table({
  tableName: 'levels',
  modelName: 'levels',
})
export class LevelsModel extends Model<
  LevelsModelAttribute,
  LevelsCreateAttribute
> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @Column
  readonly users_id: string;

  @Column({
    defaultValue: 0,
    allowNull: true,
  })
  readonly exp: number;

  @Column({
    allowNull: true,
    defaultValue: 1,
  })
  readonly level: number;
}
