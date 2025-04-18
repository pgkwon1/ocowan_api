import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalApiService } from './external-api.service';

export const API_GITHUB_SERVICE = 'API_GITHUB_ENDPOINT';
@Module({
  imports: [HttpModule.register({})],
  providers: [ExternalApiService],
  exports: [ExternalApiService],
})
export class ExternalApiModule {}
