import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelCtor } from 'sequelize-typescript';
import { LevelsLogsModel } from './entities/logs.model';
import GenericService from 'src/common/generic.service';

@Injectable()
export default class LevelsLogsService extends GenericService<LevelsLogsModel> {
  constructor(
    @InjectModel(LevelsLogsModel)
    model: ModelCtor<LevelsLogsModel>,
  ) {
    super(model);
  }
}
