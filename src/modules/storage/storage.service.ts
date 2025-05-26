import { Inject, Injectable } from '@nestjs/common';

export interface IStorageService {
  upload(file: IFileAttribute): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}

export interface IFileAttribute {
  path: string;
  buffer: Buffer;
  originalname?: string;
}
@Injectable()
export class StorageService implements IStorageService {
  constructor(
    @Inject('STORAGE_SERVICE')
    private readonly fileStorageService: IStorageService,
  ) {}

  async upload(file: IFileAttribute): Promise<{ url: string }> {
    return await this.fileStorageService.upload(file);
  }

  async delete(url: string): Promise<void> {
    return await this.fileStorageService.delete(url);
  }
}
