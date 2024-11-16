import { UUIDV4 } from 'sequelize';
import {
  Model,
  Column,
  CreatedAt,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

// 모델 속성 인터페이스 정의
interface LevelsLogsAttributes {
  id: string;
  exp: number;
  users_id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LevelsLogsCreationAttributes {
  users_id: string;
  exp: number;
}

@Table({
  tableName: 'levels_logs',
  modelName: 'levels_logs',
})
export class LevelsLogsModel extends Model<
  LevelsLogsAttributes,
  LevelsLogsCreationAttributes
> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id!: string;

  @Column({
    defaultValue: 0,
  })
  readonly exp!: number;

  @Column
  readonly users_id!: string;

  @CreatedAt
  readonly createdAt!: Date;

  @UpdatedAt
  readonly updatedAt!: Date;
}
