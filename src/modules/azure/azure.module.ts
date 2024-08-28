import { Module } from '@nestjs/common';
import { AzureService } from './azure.service';

@Module({
  providers: [AzureService],
})
export class AzureModule {}
