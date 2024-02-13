import { InjectModel } from '@nestjs/sequelize';
import { CreateOptions, WhereOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { MakeNullishOptional } from 'sequelize/types/utils';

export default interface BaseService<T extends Model> {
  create(data: Partial<T>): Promise<T>;
  update(data: Partial<T>, where: WhereOptions): Promise<T>;
  delete(id: string, where: WhereOptions): Promise<number>;
  getAll(data: Partial<T>): Promise<T[]>;
  getOne(data: Partial<T>): Promise<T>;
}
