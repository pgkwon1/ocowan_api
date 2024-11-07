import { FindOptions, WhereOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

export default interface BaseService<T extends Model> {
  create(data: Partial<T>): Promise<T>;
  update?(data: Partial<T>, where: WhereOptions): Promise<number>;
  delete(id: string, where: WhereOptions): Promise<number>;
  getAll(options: FindOptions): Promise<T[]>;
  getOne(options: FindOptions): Promise<T>;
  increment?(number: number, where: WhereOptions): Promise<boolean>;
  decrement?(number: number, where: WhereOptions): Promise<boolean>;
}
