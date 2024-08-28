import { UUIDV4 } from 'sequelize';
import {
  Column,
  CreatedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import BigThreeModel from 'src/modules/bigthree/entities/bigthree.model';
import { TeamMemberModel } from 'src/modules/team/member/entities/member.model';

@Table({
  modelName: 'users',
  tableName: 'users',
})
export default class UsersModel extends Model<UsersModel> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @Column
  readonly login: string;

  @Column
  readonly github_id: number;

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

  @Column
  readonly access_token: string;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @HasMany(() => BigThreeModel, 'users_id')
  readonly bigthree: BigThreeModel;

  @HasMany(() => TeamMemberModel, 'users_id')
  readonly team_member: TeamMemberModel;
}
