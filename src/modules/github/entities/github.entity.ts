import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class GithubEntity {
  @IsString()
  readonly id: string;

  @IsString()
  readonly github_id: number;

  @IsNumber()
  readonly login: string;

  @IsString()
  readonly avatar_url: string;

  @IsString()
  readonly bio: string;

  @IsNumber()
  readonly followers: number;

  @IsNumber()
  readonly following: number;

  @IsNumber()
  readonly public_repos: number;

  @IsString()
  readonly blog: string;

  @IsString()
  readonly access_token: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;
}

export class GithubRegister extends OmitType(GithubEntity, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class GithubUpdate extends PartialType(GithubEntity) {}
