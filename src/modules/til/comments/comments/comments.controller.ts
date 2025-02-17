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
import { CommentsService } from './comments.service';
import CommentsModel, { CreationComments } from '../../entities/comments.model';
import UsersModel from 'src/modules/users/entities/users.model';

@Controller('tils/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(`/:til_id`)
  async getAll(@Param('til_id') til_id: string) {
    return await this.commentsService.findAll({
      where: {
        til_id,
      },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'contents', 'users_id', 'createdAt'],
      include: [
        {
          model: UsersModel,
          attributes: ['login', 'avatar_url', 'followers', 'following'],
        },
      ],
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(`write`)
  async write(@Body() writeData: CreationComments) {
    return await this.commentsService.create(writeData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`:id`)
  async update(
    @Param('id') id: string,
    @Body() editData: Partial<CommentsModel>,
  ) {
    return await this.commentsService.update(editData, {
      id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`:id`)
  async delete(
    @Param('id') id: string,
    @Body() { til_id }: { til_id: string },
  ) {
    return await this.commentsService.delete(
      {
        where: {
          id,
        },
      },
      til_id,
    );
  }
}
