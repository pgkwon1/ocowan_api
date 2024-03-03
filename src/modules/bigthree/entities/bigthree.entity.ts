import { IsNumber, IsString } from 'class-validator';
import { CreatedAt, UpdatedAt } from 'sequelize-typescript';

export class BigThreeEntity {
  @IsString()
  readonly id: string;

  @IsNumber()
  readonly issueCount: number;

  @IsNumber()
  readonly pullReqCount: number;

  @IsNumber()
  readonly commitCount: number;

  @CreatedAt
  readonly createdAt?: Date;

  @UpdatedAt
  readonly updatedAt?: Date;
}
