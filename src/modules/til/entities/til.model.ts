import { InferAttributes, UUIDV4 } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { TilCreateAttrDto } from './til.entity';
import EmotifyModel from './emotify.model';
import UsersModel from 'src/modules/users/entities/users.model';
import CommentsModel from './comments.model';

export enum TIL_CATEGORY {
  '프로그래밍 언어',
  '프레임워크 및 라이브러리',
  'DevOps 및 배포',
  '데이터베이스 및 데이터',
  '컴퓨터 과학 및 알고리즘',
  '웹 개발',
  '모바일 개발',
  '테스트 및 품질 보증',
  '툴과 생산성',
  '기타 일반 주제',
  '최신 트렌드 및 학습',
  '커리어 및 성장',
  '취미 및 번외',
  '에러 해결',
}

export interface TilAttribute extends InferAttributes<TilModel> {}

export interface TilCreationAttrDao extends TilCreateAttrDto {}
@Table({
  modelName: 'til',
  tableName: 'til',
  timestamps: true,
})
export default class TilModel extends Model<TilAttribute, TilCreationAttrDao> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @ForeignKey(() => UsersModel)
  @Column
  readonly users_id: string;

  @Column({
    defaultValue: '프로그래밍 언어',
  })
  readonly category: TIL_CATEGORY;

  @Column
  readonly title: string;

  @Column
  readonly contents: string;

  @Column
  readonly slug: string;

  @Column({
    defaultValue: 0,
  })
  readonly thumbsUpCnt: number;

  @Column({
    defaultValue: 0,
  })
  readonly heartCnt: number;

  @Column({
    defaultValue: 0,
  })
  readonly smileCnt: number;

  @Column({
    defaultValue: 0,
  })
  readonly fireCnt: number;

  @Column({
    defaultValue: 0,
  })
  readonly ideaCnt: number;

  @Column({
    defaultValue: 0,
  })
  readonly viewCnt: number;

  @Column({
    defaultValue: 0,
  })
  readonly commentsCnt: number;

  @HasMany(() => EmotifyModel, 'til_id')
  emotify: EmotifyModel[];

  @BelongsTo(() => UsersModel, 'users_id')
  readonly users: UsersModel;

  @HasMany(() => CommentsModel, 'til_id')
  readonly comments: CommentsModel[];
}
