import { Injectable } from '@nestjs/common';
import OcowanModel from './entities/ocowan.model';
import GenericService from 'src/common/generic.service';

@Injectable()
export class OcowanService extends GenericService<OcowanModel> {
  constructor() {
    super(OcowanModel);
  }
}
