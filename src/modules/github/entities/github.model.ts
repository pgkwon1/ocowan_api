import { UUIDV4 } from 'sequelize';
import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  modelName: 'github',
  tableName: 'github',
})
export default class GithubModel extends Model<GithubModel> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @Column
  readonly login: number;

  @Column
  readonly github_id: string;

  @Column
  readonly avatar_url: string;

  @Column
  readonly bio: string;

  @Column({
    defaultValue: 0,
  })
  readonly followers: number;

  @Column({
    defaultValue: 0,
  })
  readonly following: number;

  @Column({
    defaultValue: 0,
  })
  readonly public_repos: number;

  @Column
  readonly blog: string;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;
}
