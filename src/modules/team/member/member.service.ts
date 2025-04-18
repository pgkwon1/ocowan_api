import { Injectable } from '@nestjs/common';
import { TeamMemberModel } from './entities/member.model';
import GenericService from 'src/common/generic.service';

@Injectable()
export class TeamMemberService extends GenericService<TeamMemberModel> {
  constructor() {
    super(TeamMemberModel);
  }
}
