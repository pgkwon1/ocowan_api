import { UUIDV4 } from 'sequelize';
import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import TilModel from './til.model';

export enum EMOTIFY_TYPE {
  'thumbsUp',
  'heart',
  'smile',
  'fire',
  'idea',
}

export interface EmotifyAttribute {
  id: string;
  users_id: string;
  type: EMOTIFY_TYPE;
}

export interface EmotifyCreationAttribute {
  users_id: string;
  til_id: string;
  type: EMOTIFY_TYPE;
}

@Table({
  tableName: 'emotify',
  modelName: 'emotify',
})
export default class EmotifyModel extends Model<
  EmotifyAttribute,
  EmotifyCreationAttribute
> {
  @PrimaryKey
  @Column({
    defaultValue: UUIDV4(),
  })
  readonly id: string;

  @Column
  readonly users_id: string;

  @ForeignKey(() => TilModel)
  readonly til_id: string;

  @Column
  readonly type: EMOTIFY_TYPE;
}
