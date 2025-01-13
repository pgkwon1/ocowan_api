import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TilService } from './til.service';
import TilModel from './entities/til.model';
import { TilCreateAttrDto } from './entities/til.entity';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import EmotifyModel from './entities/emotify.model';
import { FindOptions, Sequelize } from 'sequelize';
import UsersModel from '../users/entities/users.model';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { EmotifyService } from './emotify/emotify.service';

@Controller('tils')
export class TilController {
  constructor(
    private readonly tilService: TilService,
    private readonly redisService: RedisService,
    private readonly emotifyService: EmotifyService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAll(): Promise<TilModel[]> {
    return await this.tilService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:slug')
  async getOne(
    @Param('slug') slug: string,
    @Jwt() token: JwtEntity,
  ): Promise<TilModel> {
    const options: FindOptions<TilModel> = {
      where: {
        slug,
      },
      include: [
        {
          model: EmotifyModel,
          attributes: [[Sequelize.col('type'), 'type']],
        },
        {
          model: UsersModel,
          attributes: ['login', 'avatar_url', 'followers', 'bio'],
        },
      ],
    };

    const viewKey = `til-view-${slug}-${token.login}`;
    const isViewByUser: string | null =
      await this.redisService.getValue(viewKey);

    if (isViewByUser === null) {
      /* 조회 여부 redis에 저장 60초 동안 유지 */
      await this.redisService.setExValue(viewKey, '1', 60);
      /* 조회수 증가 */
      await this.tilService.increment({ viewCnt: 1 }, options.where);
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
    data.slug = data.title.replaceAll(' ', '-').replaceAll('_', '-');
    data.slug = `${data.slug}-${uuidv4().replace(/-/g, '').substring(0, 12)}`; // 첫 12자리만 반환

    const createData = {
      ...data,
      users_id: token.id,
    };
    return (await this.tilService.create(createData)).slug;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/edit')
  async update(
    @Body() updatedData: Partial<TilModel>,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.tilService.update(updatedData, {
      id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const transactionList: Array<() => Promise<void>> = [
      async () =>
        await this.emotifyService.delete({
          where: {
            til_id: id,
          },
        }),
      async () =>
        await this.tilService.delete({
          where: {
            id,
          },
        }),
    ];
    return await this.tilService.executeTransaction(transactionList);
  }
}
