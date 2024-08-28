import { IsDate, IsNumber, IsString } from 'class-validator';

export default class InviteEntity {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly leader: string;

  @IsString()
  readonly logo: string;

  @IsNumber()
  readonly member_count: number;

  @IsDate()
  readonly createdAt?: string;

  @IsDate()
  readonly updatedAt?: string;
}

export type InviteMutation = Partial<InviteEntity>;
