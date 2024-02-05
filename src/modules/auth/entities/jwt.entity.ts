import { IsString } from 'class-validator';

export class JwtEntity {
  @IsString()
  readonly login: string;

  @IsString()
  readonly github_id: string;

  @IsString()
  readonly access_token: string;
}
