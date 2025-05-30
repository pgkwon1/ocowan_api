import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TilService } from './til.service';
import TilModel from './entities/til.model';
import { TilCreateAttrDto } from './entities/til.entity';
import { Jwt, OptionalJwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import { FindOptions } from 'sequelize';
import UsersModel from '../users/entities/users.model';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { put } from '@vercel/blob';
import { CustomFileDecorator } from 'src/decorators/file.decorator';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';

@Controller('tils')
export class TilController {
  constructor(
    private readonly tilService: TilService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}
  @Get('/page/:page')
  async getAll(
    @Param('page') page: number = 1,
    @Query('category') category: string,
    @Query('order') order: 'createdAt' | 'viewCnt' | 'commentsCnt',
    @Query('users_id') users_id?: string,
  ): Promise<{ tilList: TilModel[]; totalCount: number }> {
    const where = {
      ...(category !== '전체' && { category }),
      ...(users_id && { users_id }),
    };
    const limit = 10;
    const options: FindOptions<TilModel> = {
      where,
      limit,
      offset: (page - 1) * limit,
      attributes: [
        'title',
        'slug',
        'thumbsUpCnt',
        'heartCnt',
        'smileCnt',
        'fireCnt',
        'ideaCnt',
        'viewCnt',
        'commentsCnt',
        'category',
        'createdAt',
        'contents',
      ],
      order: [[order, 'DESC']],
      include: [
        {
          model: UsersModel,
          as: 'users',
          attributes: ['avatar_url', 'followers', 'following', 'login'],
        },
      ],
    };

    const totalCount = await this.tilService.count({
      where,
    });

    const tilList = await this.tilService.findAll(options);

    return {
      tilList,
      totalCount,
    };
  }

  @Get('/:slug')
  async getOne(
    @Param('slug') slug: string,
    @OptionalJwt() token: JwtEntity,
  ): Promise<TilModel> {
    const options: FindOptions<TilModel> = {
      where: {
        slug,
      },
      include: [
        {
          model: UsersModel,
          attributes: ['login', 'avatar_url', 'following', 'followers', 'bio'],
        },
      ],
    };
    if (token !== undefined) {
      const viewKey = `til-view-${slug}-${token.login}`;
      const isViewByUser: string | null =
        await this.redisService.getValue(viewKey);

      if (isViewByUser === null) {
        /* 조회 여부 redis에 저장 60초 동안 유지 */
        await this.redisService.setExValue(viewKey, '1', 60);
        /* 조회수 증가 */
        await this.tilService.increment({ viewCnt: 1 }, options.where);
      }
    }
    return await this.tilService.findOne(options);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/write')
  async create(
    @Body() data: TilCreateAttrDto,
    @Jwt() token: JwtEntity,
  ): Promise<string> {
    /* til slug 생성 제목-임의 12개 문자열 조합 */
    data.slug = `${uuidv4().replace(/-/g, '').substring(0, 12)}`; // 첫 12자리만 반환

    const createData = {
      ...data,
      users_id: token.id,
    };
    return (await this.tilService.create(createData)).slug;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async update(
    @Body() editData: Partial<TilModel>,
    @Param('id') id: string,
  ): Promise<{
    title: string;
    slug: string;
  }> {
    const updatedData = await this.tilService.update(editData, {
      id,
    });

    return {
      title: editData.title,
      slug: updatedData.slug,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string, @Jwt() token: JwtEntity) {
    const options = {
      where: {
        id,
        users_id: token.id,
      },
    };
    return await this.tilService.delete(options, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @CustomFileDecorator({ fieldName: 'tilImage', destination: 'upload/til' })
  @Put(`/upload`)
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const fileBuffer = await fs.readFile(file.path);

    const { url } = await put(file.path, fileBuffer, {
      access: 'public',
      token: this.configService.get('BLOB_READ_WRITE_TOKEN'),
    });
    fs.unlink(file.path);
    // 업로드 성공시

    if (url && typeof url === 'string') {
      return { url };
    }
    return { url: '' };
  }
}
