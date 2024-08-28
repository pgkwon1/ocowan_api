import { IsNumber, IsString } from 'class-validator';
import { CreatedAt, UpdatedAt } from 'sequelize-typescript';

export default class TeamEntity {
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

  @CreatedAt
  readonly createdAt?: Date;

  @UpdatedAt
  readonly updatedAt?: Date;
}
