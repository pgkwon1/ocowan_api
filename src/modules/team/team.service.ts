import { Injectable } from '@nestjs/common';
import { TeamModel } from './entities/team.model';
import GenericService from 'src/common/generic.service';

@Injectable()
export class TeamService extends GenericService<TeamModel> {
  constructor() {
    super(TeamModel);
  }
}
