import { InferAttributes, UUIDV4 } from 'sequelize';
import {
  Column,
  CreatedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { TeamMemberModel } from '../member/entities/member.model';
import { TeamInviteModel } from '../invite/entities/invite.model';

interface TeamAttributes extends InferAttributes<TeamModel> {}
interface TeamCreationAttr extends Omit<TeamAttributes, 'id'> {}
@Table({
  modelName: 'team',
  tableName: 'team',
})
export class TeamModel extends Model<TeamAttributes, TeamCreationAttr> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @Column
  readonly name: string;

  @Column
  readonly description: string;

  @Column
  readonly leader: string;

  @Column
  readonly logo: string;

  @Column
  readonly member_count: number;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @HasMany(() => TeamMemberModel, 'team_id')
  readonly teamMember: TeamMemberModel[];

  @HasMany(() => TeamInviteModel, 'team_id')
  readonly team_invite: TeamInviteModel[];
}
