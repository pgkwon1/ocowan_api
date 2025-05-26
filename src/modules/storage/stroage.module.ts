import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import StorageController from './storage.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import VercelBlobService from '../vercel-blob/vercel-blob.service';
import { AzureModule } from '../azure/azure.module';
import { AzureService } from '../azure/azure.service';
import { VercelBlobModule } from '../vercel-blob/vercel-blob.module';

@Module({
  imports: [ConfigModule, VercelBlobModule, AzureModule],
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: 'STORAGE_SERVICE',
      useFactory: (
        configService: ConfigService,
        vercelBlobStorage: VercelBlobService,
        azureStorage: AzureService,
      ) => {
        const storageType = configService.get('storageType');
        if (storageType === 'vercel-blob' || !storageType)
          return vercelBlobStorage;
        if (storageType === 'azure') return azureStorage;
      },
      inject: [ConfigService, VercelBlobService, AzureService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
