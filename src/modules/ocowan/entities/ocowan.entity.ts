import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreatedAt, UpdatedAt } from 'sequelize-typescript';

export default class OcowanEntity {
  @IsString()
  readonly id: string;

  @IsString()
  readonly users_id: string;

  @IsNumber()
  readonly total_count: number;

  @IsString()
  @IsOptional()
  readonly ocowan_date?: string;

  @CreatedAt
  readonly createdAt?: Date;

  @UpdatedAt
  readonly updatedAt?: Date;
}

export class OcowanCheck extends PickType(OcowanEntity, ['users_id']) {}
export class OcowanFinish extends OmitType(OcowanEntity, ['id']) {}
export class OcowanGet extends PickType(OcowanEntity, [
  'users_id',
  'ocowan_date',
]) {}
