import { IsDate, IsNumber, IsString } from 'class-validator';

export default class LevelsLogsEntity {
  @IsString()
  readonly id: string;

  @IsNumber()
  readonly exp!: number;

  @IsString()
  readonly users_id!: string;

  @IsDate()
  readonly createdAt?: Date;

  @IsDate()
  readonly updatedAt: Date;
}
