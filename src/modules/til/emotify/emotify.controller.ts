import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmotifyService } from './emotify.service';
import { AuthGuard } from '@nestjs/passport';
import { EmotifyCreationAttribute } from '../entities/emotify.model';
import { Jwt, OptionalJwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from 'src/modules/auth/entities/jwt.entity';
import { TilService } from '../til.service';
import TilModel from '../entities/til.model';
import { FindOptions } from 'sequelize';

@Controller('emotify')
export class EmotifyController {
  constructor(
    private readonly emotifyService: EmotifyService,
    private readonly tilService: TilService,
  ) {}

  @Get('/:til_id')
  async getEmotify(
    @Param('til_id') til_id: string,
    @OptionalJwt() token: JwtEntity,
  ) {
    const users_id = token ? token.id : '';
    const findOptions: FindOptions = {
      where: {
        til_id,
        users_id,
      },
      attributes: ['type'],
    };

    const result = await this.emotifyService.findAll(findOptions);
    return result;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async emotify(
    @Jwt() token: JwtEntity,
    @Body() data: EmotifyCreationAttribute,
  ) {
    const { til_id, type } = data;
    const isEmotify = await this.emotifyService.count({
      where: {
        til_id,
        type,
        users_id: token.id,
      },
    });

    if (isEmotify > 0) {
      throw new HttpException(
        '이미 해당 이모지를 누르셨습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    data.users_id = token.id;
    const transactionList = [
      async () => await this.emotifyService.create(data),
      async () =>
        await this.tilService.increment(
          {
            [`${type}Cnt`]: 1,
          },
          {
            id: til_id,
          },
        ),
    ];

    const result =
      await this.tilService.executeTransactionNonOrder(transactionList);
    const tilResult = result[1] as Partial<TilModel>;
    return {
      type: type,
      count: tilResult[`${type}Cnt`] + 1,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete')
  async delete(
    @Jwt() token: JwtEntity,
    @Body() data: { til_id: string; type: string },
  ) {
    const { til_id, type } = data;

    const where = {
      users_id: token.id,
      til_id,
      type,
    };

    const isEmotify = await this.emotifyService.findOne({ where });
    if (!isEmotify) {
      throw new HttpException(
        '이모지가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const transactionList = [
      async () => await this.emotifyService.delete({ where }),
      async () => {
        await this.tilService.decrement(
          {
            [`${type}Cnt`]: 1,
          },

          {
            id: til_id,
          },
        );
        return true;
      },
    ];

    await this.emotifyService.executeTransactionNonOrder(transactionList);
    return type;
  }
}
