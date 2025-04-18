import { Injectable } from '@nestjs/common';
import {
  TeamInviteCreationAttr,
  TeamInviteModel,
} from './entities/invite.model';
import GenericService from 'src/common/generic.service';

@Injectable()
export class TeamInviteService extends GenericService<TeamInviteModel> {
  constructor() {
    super(TeamInviteModel);
  }
  async create(data: TeamInviteCreationAttr): Promise<TeamInviteModel> {
    const result = await super.create(data);
    if (result.id) {
      result.token = btoa(result.id);
      result.save();
    }
    return result;
  }
}
