import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TIL_CATEGORY } from './til.model';

export default class TIL_ENTITY {
  @IsString()
  readonly id: string;

  @IsString()
  readonly users_id: string;

  @IsEnum(TIL_CATEGORY)
  readonly category: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly contents: Text;

  @IsString()
  slug: string;

  @IsNumber()
  readonly thumbsUpCnt: number;

  @IsNumber()
  readonly heartCnt: number;

  @IsNumber()
  readonly smileCnt: number;

  @IsNumber()
  readonly fireCnt: number;

  @IsNumber()
  readonly ideaCnt: number;
}

type NonRequiredCreationColumn =
  | 'id'
  | 'thumbsUpCnt'
  | 'heartCnt'
  | 'smileCnt'
  | 'fireCnt'
  | 'ideaCnt';

export interface TilCreateAttrDto
  extends Omit<TIL_ENTITY, NonRequiredCreationColumn> {}
