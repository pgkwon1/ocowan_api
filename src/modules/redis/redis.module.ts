import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { RedisService } from './redis.service';

dotenv.config();

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          host: process.env.REDIS_CLIENT_HOST,
          port: Number(process.env.REDIS_CLIENT_PORT),
        });

        client.on('connect', () => {
          console.log('redis connect');
        });
        client.on('error', (error) => {
          console.log(`redis error : ${error}`);
        });

        return client;
      },
    },
    RedisService,
  ],
})
export class RedisModule {}
