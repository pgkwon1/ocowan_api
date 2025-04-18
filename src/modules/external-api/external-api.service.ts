import { HttpService } from '@nestjs/axios';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpClient: HttpService) {}

  async get() {
    throw new NotImplementedException('Not Implement');
  }

  async post(
    url: string,
    data: any,
    headers: RawAxiosRequestHeaders = { 'Content-Type': 'applicatin-json' },
  ): Promise<AxiosResponse> {
    const result = await lastValueFrom(
      this.httpClient.post(url, data, {
        headers,
      }),
    );
    return result;
  }
}
