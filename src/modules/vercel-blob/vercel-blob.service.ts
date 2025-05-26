import { Injectable } from '@nestjs/common';
import { del, put } from '@vercel/blob';
import { ConfigService } from '@nestjs/config';

interface FileAttribute {
  path: string;
  buffer: Buffer;
}
@Injectable()
export default class VercelBlobService {
  private readonly blobToken: string;
  constructor(private readonly configService: ConfigService) {
    this.blobToken = this.configService.get('BLOB_READ_WRITE_TOKEN');
  }

  async upload(file: FileAttribute): Promise<{ url: string }> {
    const { url } = await put(file.path, file.buffer, {
      access: 'public',
      token: this.blobToken,
    });
    return { url };
  }

  async delete(url: string): Promise<void> {
    await del(url, {
      token: this.blobToken,
    });
  }
}
