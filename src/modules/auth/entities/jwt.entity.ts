import { IsString } from 'class-validator';

export class JwtEntity {
  @IsString()
  readonly login: string;

  @IsString()
  readonly id: string;
  /* 깃허브 에서 전달 받은 계정의 Access token */
  @IsString()
  readonly access_token: string;

  @IsString()
  readonly github_id: string;
}
