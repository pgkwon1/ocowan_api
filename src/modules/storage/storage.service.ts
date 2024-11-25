import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly s3: S3;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get<string>('REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_S3_SECRET_KEY'),
      },
    });
  }

  async upload(file: Express.Multer.File): Promise<{ url: string }> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3.send(command);
    return {
      url: `https://${this.configService.get<string>('BUCKET_NAME')}.s3.amazonaws.com/${file.originalname}`,
    };
  }
}
