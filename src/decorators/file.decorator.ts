import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { imageFileFilter } from 'src/utils/file.filter';

export const CustomFileDecorator = (data: {
  fieldName: string;
  destination: string;
}) => {
  const { fieldName, destination } = data;
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        fileFilter: imageFileFilter,
        storage: diskStorage({
          destination,
          filename: (req, file: Express.Multer.File, callback) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const expName = path.extname(file.originalname);
            file.originalname = btoa(file.originalname);

            const filename = `${unique}-${file.originalname}${expName}`;
            callback(null, filename);
          },
        }),
      }),
    ),
  );
};
