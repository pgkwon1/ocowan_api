import { IsDate, IsString } from 'class-validator';

export default class MemberEntity {
  @IsString()
  readonly id: string;

  @IsString()
  readonly users_id: string;

  @IsString()
  readonly team_id: string;

  @IsDate()
  readonly join_date?: Date;

  @IsDate()
  readonly createdAt?: Date;

  @IsDate()
  readonly updatedAt?: Date;
}

export type MemberMutation = Partial<MemberEntity>;
export type MemberJoin = Pick<MemberEntity, 'users_id' | 'team_id'> & {
  inviteToken: string;
};
export type MemberIsJoin = Omit<MemberJoin, 'users_id' | 'inviteToken'>;
