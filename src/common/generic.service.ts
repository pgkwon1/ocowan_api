import { HttpException, HttpStatus } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

/**
 * Generic Service
 * T : 모델 클래스 파일 TCreationAttributes 인터페이스 구현 필수
 * E : 엔티티 클래스 파일
 */

export default class GenericService<T extends Model> {
  private readonly model: ModelCtor<T>;
  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async create(data: T['_creationAttributes']): Promise<T> {
    const result = await this.model.create(data);

    if (!result) {
      throw new HttpException(
        '데이터 생성 오류',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async findOne(where: WhereOptions<T>): Promise<T> {
    const data = await this.model.findOne({
      where,
    });

    if (!data) {
      throw new HttpException('데이터 조회 오류', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async findAll(where: WhereOptions = { 1: 1 }): Promise<T[]> {
    const data = await this.model.findAll({
      where,
    });

    if (!data) {
      throw new HttpException('데이터 조회 오류', HttpStatus.NOT_FOUND);
    }
    return data;
  }
  async update(data: Partial<T>, where: WhereOptions): Promise<boolean> {
    const instance = await this.findOne(where);
    const updatedData = await instance.update(data);

    if (!updatedData) {
      throw new HttpException(
        '데이터 수정 오류',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return false;
  }

  async delete(where: WhereOptions): Promise<void> {
    const instance = await this.findOne(where);
    await instance.destroy();
    return null;
  }

  async increment(
    increaseField: { [key: string]: number },
    where: WhereOptions<T>,
  ): Promise<boolean> {
    const instance = await this.findOne(where);
    const result = await instance.increment(increaseField, {
      where,
    });

    if (!result) {
      throw new HttpException(
        '데이터 수정 오류',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  async decrement(
    decreaseField: { [key: string]: number },
    where: WhereOptions<T>,
  ): Promise<boolean> {
    const instance = await this.findOne(where);
    const result = await instance.decrement(decreaseField, {
      where,
    });

    if (!result) {
      throw new HttpException(
        '데이터 수정 오류',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }
}
