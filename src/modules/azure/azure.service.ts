import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { IFileAttribute, IStorageService } from '../storage/storage.service';
dotenv.config();
@Injectable()
export class AzureService implements IStorageService {
  private azureConnection;
  private containerName;

  constructor() {
    this.azureConnection = process.env.AZURE_CONNECTION_NAME;
    this.containerName = process.env.AZURE_CONTAINER_NAME;
  }

  getBlobClient(file: string): BlockBlobClient {
    const blobContainerService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );

    const containerClient = blobContainerService.getContainerClient(
      this.containerName,
    );

    return containerClient.getBlockBlobClient(file);
  }

  async upload(file: IFileAttribute): Promise<{ url: string }> {
    const blobClient = this.getBlobClient(file.originalname);
    const result = await blobClient.uploadData(file.buffer);
    const url = blobClient.url;
    if (result === null) {
      throw new Error('파일 업로드에 실패하였습니다.');
    }
    return { url };
  }

  async delete(url: string): Promise<void> {
    const fileName = url.split('/').pop();
    if (!fileName) {
      throw new Error('올바르지 않은 URL 형식입니다.');
    }

    const blobClient = this.getBlobClient(fileName);
    await blobClient.delete();
  }
}
