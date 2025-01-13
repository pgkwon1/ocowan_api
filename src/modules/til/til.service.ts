import { Injectable } from '@nestjs/common';
import GenericService from 'src/common/generic.service';
import TilModel from './entities/til.model';

@Injectable()
export class TilService extends GenericService<TilModel> {
  constructor() {
    super(TilModel);
  }
}
