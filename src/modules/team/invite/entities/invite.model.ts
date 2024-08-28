import { UUIDV4 } from 'sequelize';
import { TeamModel } from '../../entities/team.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'team_invite',
  modelName: 'team_invite',
})
export class TeamInviteModel extends Model<TeamInviteModel> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @ForeignKey(() => TeamModel)
  @Column
  readonly team_id: string;

  @Column
  token: string;

  @Column
  readonly expire_time: string;

  @Column({
    defaultValue: 0,
  })
  readonly isValid?: number;

  @BelongsTo(() => TeamModel, 'team_id')
  readonly team: TeamModel;
}
