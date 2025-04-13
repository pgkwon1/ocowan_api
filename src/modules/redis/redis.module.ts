import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { RedisService } from './redis.service';

dotenv.config();

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
