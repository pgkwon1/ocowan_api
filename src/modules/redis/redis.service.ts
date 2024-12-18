import { HttpException, Injectable } from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';
import * as dotenv from 'dotenv';
import Redis, { RedisKey } from 'ioredis';

dotenv.config();

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async hashSetValue(key: RedisKey, data: Record<string, string>) {
    return new Promise((resolve) => {
      this.redisClient.hset(key, data, (err, result) => {
        if (err)
          throw new HttpException('알 수 없는 오류가 발생하였습니다', 500);
        resolve(result);
      });
    });
  }

  async hashGetValue(key: RedisKey, field: string): Promise<string> {
    return new Promise((resolve) => {
      this.redisClient.hget(key, field, (err, result) => {
        if (err)
          throw new HttpException('알 수 없는 오류가 발생하였습니다', 500);
        resolve(result);
      });
    });
  }

  async setValue(key: RedisKey, value: string): Promise<number> {
    return new Promise((resolve) => {
      this.redisClient.set(key, value, 'GET', (err, result) => {
        if (err)
          throw new HttpException('알 수 없는 오류가 발생하였습니다', 500);
        resolve(Number(result));
      });
    });
  }

  async getValue(key: RedisKey) {
    return new Promise((resolve) => {
      this.redisClient.get(key, (err, result) => {
        if (err)
          throw new HttpException('알 수 없는 오류가 발생하였습니다', 500);
        resolve(result);
      });
    });
  }

  async setExValue(key: RedisKey, value: string, ttl: number) {
    return new Promise((resolve, reject) => {
      this.redisClient.setex(key, ttl, value, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async getExValue(key: RedisKey, ttl: number) {
    return new Promise((resolve, reject) => {
      this.redisClient.getex(key, 'EX', ttl, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
