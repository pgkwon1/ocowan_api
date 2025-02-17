import { HttpException, HttpStatus } from '@nestjs/common';
import {
  FindOptions,
  InferAttributes,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

type ModelAttribute<T extends Model> = InferAttributes<T>;
/**
 * Generic Service
 * T : 모델 클래스 파일 TCreationAttributes 인터페이스 구현 필수
 * E : 엔티티 클래스 파일
 */
export default class GenericService<T extends Model> {
  private readonly model: ModelCtor<T>;
  private transaction: Transaction;
  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async create(data: T['_creationAttributes']): Promise<T> {
    const result = await this.model.create(data, {
      transaction: this.transaction || null,
    });

    if (!result) {
      throw new HttpException(
        '데이터 생성 오류',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async findOne(options: FindOptions<T>): Promise<T> {
    const data = await this.model.findOne(options);

    if (!data) {
      throw new HttpException('데이터 조회 오류', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async findAll(options: FindOptions<T>): Promise<T[]> {
    const data = await this.model.findAll(options);

    if (!data) {
      throw new HttpException('데이터 조회 오류', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  async count(options: FindOptions<T>): Promise<number> {
    return await this.model.count(options);
  }

  async update(data: Partial<T>, where: WhereOptions): Promise<Partial<T>> {
    const instance = await this.findOne({ where });
    const updatedData = await instance.update(data, {
      transaction: this.transaction || null,
    });
    if (!updatedData) {
      throw new HttpException(
        '데이터 수정 오류',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedData;
  }

  async delete(options: FindOptions<T>): Promise<void> {
    const instance = await this.model.findOne(options);

    if (instance) {
      await instance.destroy({
        transaction: this.transaction || null,
      });
    }
    return null;
  }

  async increment(
    increaseField: { [K in keyof ModelAttribute<T>]?: number },
    where: WhereOptions<T>,
  ): Promise<boolean | Partial<T>> {
    const instance = await this.findOne({
      where,
    });
    const result = await instance.increment(increaseField, {
      where,
      transaction: this.transaction || null,
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
    decreaseField: { [K in keyof ModelAttribute<T>]?: number },
    where: WhereOptions<T>,
  ): Promise<boolean | Partial<T>> {
    const instance = await this.findOne({
      where,
    });

    const result = await instance.decrement(decreaseField, {
      where,
      transaction: this.transaction || null,
    });

    if (!result) {
      throw new HttpException(
        '데이터 수정 오류',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  /* 트랜잭션 처리 순서 보장됨 */
  async executeTransaction(
    transactionList: Array<
      () => Promise<Model<any, any> | Partial<T> | boolean | void>
    > /* transaction 말고도 메소드 마다의 파라미터 들을 받아서 추가 처리 필요 */,
  ) {
    this.transaction = await this.model.sequelize.transaction();

    try {
      for (const execTransaction of transactionList) {
        await execTransaction();
      }
      await this.transaction.commit();
      this.transaction = null;
    } catch (error) {
      console.log('err', error);
      await this.transaction.rollback();
      this.transaction = null;
      throw new HttpException(
        '처리 중 오류가 발생하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* 트랜잭션 일괄처리 (순서 보장 안됨) */
  async executeTransactionNonOrder(
    transactionList: Array<
      () => Promise<boolean | void | Model<any, any> | Partial<T>>
    >,
  ): Promise<Array<boolean | void | Model<any, any> | Partial<T>>> {
    try {
      this.transaction = await this.model.sequelize.transaction();
      const result = await Promise.all(
        transactionList.map((execTransaction) => execTransaction()),
      );

      await this.transaction.commit();
      this.transaction = null;
      return result;
    } catch (err) {
      this.transaction.rollback();
      this.transaction = null;
      throw new HttpException(
        '처리 중 오류가 발생하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
