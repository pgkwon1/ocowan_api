import { IsString } from 'class-validator';

export class JwtEntity {
  @IsString()
  readonly login: string;

  @IsString()
  readonly id: string;

  @IsString()
  readonly access_token: string;
}
