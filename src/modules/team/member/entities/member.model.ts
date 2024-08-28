import { UUIDV4 } from 'sequelize';
import { TeamModel } from '../../entities/team.model';
import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import UsersModel from 'src/modules/users/entities/users.model';

@Table({
  tableName: 'team_member',
  modelName: 'team_member',
})
export class TeamMemberModel extends Model<TeamMemberModel> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @ForeignKey(() => UsersModel)
  @Column
  readonly users_id: string;

  @ForeignKey(() => TeamModel)
  @Column
  readonly team_id: string;

  @Column
  readonly join_date: string;

  @Column({
    defaultValue: 0,
  })
  readonly leader_yn: boolean;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @BelongsTo(() => TeamModel, 'team_id')
  readonly team: TeamModel;

  @BelongsTo(() => UsersModel, 'users_id')
  readonly users: UsersModel;
}
