import { InferAttributes, UUIDV4 } from 'sequelize';
import { TeamModel } from '../../entities/team.model';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

interface TeamInviteAttributes extends InferAttributes<TeamInviteModel> {}
export interface TeamInviteCreationAttr
  extends Pick<TeamInviteModel, 'team_id' | 'expire_time'> {}
@Table({
  tableName: 'team_invite',
  modelName: 'team_invite',
})
export class TeamInviteModel extends Model<
  TeamInviteAttributes,
  TeamInviteCreationAttr
> {
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
