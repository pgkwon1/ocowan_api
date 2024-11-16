import { IsNumber, IsString } from 'class-validator';

export default class LevelsEntity {
  @IsString()
  readonly id: string;

  @IsString()
  readonly users_id: string;

  @IsNumber()
  readonly scores: number;

  @IsNumber()
  readonly levels: number;
}
