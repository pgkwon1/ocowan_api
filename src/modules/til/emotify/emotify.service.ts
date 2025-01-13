import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelCtor } from 'sequelize-typescript';
import GenericService from 'src/common/generic.service';
import EmotifyModel from '../entities/emotify.model';

@Injectable()
export class EmotifyService extends GenericService<EmotifyModel> {
  constructor(@InjectModel(EmotifyModel) model: ModelCtor<EmotifyModel>) {
    super(model);
  }
}
