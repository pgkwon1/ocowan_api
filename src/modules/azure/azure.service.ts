import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AzureService {
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

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const blobClient = this.getBlobClient(file.originalname);
    const result = await blobClient.uploadData(file.buffer);
    const imageUrl = blobClient.url;
    if (result === null) {
      throw new Error('파일 업로드에 실패하였습니다.');
    }
    return imageUrl;
  }
}
