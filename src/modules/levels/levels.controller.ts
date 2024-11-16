import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtEntity } from '../auth/entities/jwt.entity';
import LevelsService from './levels.service';
import { WhereOptions } from 'sequelize';
import { LevelsModel } from './entities/levels.model';
import LevelsEntity from './entities/levels.entity';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getInfo(@Jwt() token: JwtEntity) {
    const { id: users_id } = token;

    const findInfo: WhereOptions = {
      where: {
        users_id,
      },
    };

    const result = await this.levelsService.findOne(findInfo);

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/increment')
  async increment(
    @Jwt() token: JwtEntity,
    @Body() body: Partial<LevelsEntity>,
  ) {
    const { exp }: Partial<LevelsModel> = body;
    const { id } = token;
    const where: WhereOptions = {
      users_id: id,
    };
    const result = await this.levelsService.increment({ exp }, where);
    return result;
  }
}
