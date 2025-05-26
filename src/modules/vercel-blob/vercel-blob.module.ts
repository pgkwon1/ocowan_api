import { Module } from '@nestjs/common';
import VercelBlobService from './vercel-blob.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [VercelBlobService],
  exports: [VercelBlobService],
})
export class VercelBlobModule {}
