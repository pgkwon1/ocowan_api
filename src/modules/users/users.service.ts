import { Injectable } from '@nestjs/common';
import UsersModel from './entities/users.model';
import GenericService from 'src/common/generic.service';

@Injectable()
export default class UsersService extends GenericService<UsersModel> {
  constructor() {
    super(UsersModel);
  }
}
