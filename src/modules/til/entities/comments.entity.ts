import { IsString } from 'class-validator';

export default class CommentsEntity {
  @IsString()
  readonly id: string;

  @IsString()
  readonly til_id: string;

  @IsString()
  readonly users_id: string;

  @IsString()
  readonly contents: string;
}
