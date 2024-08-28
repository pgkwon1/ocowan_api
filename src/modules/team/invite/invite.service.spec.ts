import { Test, TestingModule } from '@nestjs/testing';
import { TeamInviteService } from './invite.service';

describe('TeamInviteService', () => {
  let service: TeamInviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamInviteService],
    }).compile();

    service = module.get<TeamInviteService>(TeamInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
