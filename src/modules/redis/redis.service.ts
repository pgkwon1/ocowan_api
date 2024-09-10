import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import Redis, { RedisKey } from 'ioredis';

dotenv.config();

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async hashSetValue(key: RedisKey, data: Record<string, string>) {
    return this.redisClient.hset(key, data);
  }

  async hashGetValue(key: RedisKey, field: string) {
    return this.redisClient.hget(key, field);
  }

  async setValue(key: RedisKey, value: string) {
    return this.redisClient.set(key, value);
  }

  async getValue(key: RedisKey) {
    return this.redisClient.get(key);
  }
}
