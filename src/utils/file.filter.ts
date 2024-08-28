import { HttpException } from '@nestjs/common';
import { FileFilterCallback } from 'multer';

export const imageFileFilter = (
  req,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  console.log('zz');
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    callback(new HttpException('이미지만 업로드 해주세요', 400));
  }

  callback(null, true);
};
