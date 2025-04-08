import { InferAttributes, UUIDV4 } from 'sequelize';
import {
  Column,
  CreatedAt,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import BigThreeModel from 'src/modules/bigthree/entities/bigthree.model';
import { LevelsModel } from 'src/modules/levels/entities/levels.model';
import OcowanModel from 'src/modules/ocowan/entities/ocowan.model';
import { TeamMemberModel } from 'src/modules/team/member/entities/member.model';
import TilModel from 'src/modules/til/entities/til.model';

interface UserAttributes extends InferAttributes<UsersModel> {}
interface UserCreationAttr extends Omit<UserAttributes, 'id'> {}
@Table({
  modelName: 'users',
  tableName: 'users',
})
export default class UsersModel extends Model<UsersModel, UserCreationAttr> {
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

  @HasMany(() => OcowanModel, 'users_id')
  readonly ocowan: OcowanModel;

  @HasMany(() => BigThreeModel, 'users_id')
  readonly bigthree: BigThreeModel;

  @HasMany(() => TeamMemberModel, 'users_id')
  readonly team_member: TeamMemberModel;

  @HasOne(() => LevelsModel, 'users_id')
  readonly levels: LevelsModel;

  @HasMany(() => TilModel, 'users_id')
  readonly til: TilModel;
}
