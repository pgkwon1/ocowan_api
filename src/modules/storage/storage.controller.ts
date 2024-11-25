import {
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { HttpStatusCode } from 'axios';

@Controller('storages')
export default class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file')) // 'file'은 form-data의 필드 이름
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new HttpException(
        '비정상적인 접근입니다.',
        HttpStatusCode.BadRequest,
      );
    }
    const url = await this.storageService.upload(file);

    return url;
  }
}
