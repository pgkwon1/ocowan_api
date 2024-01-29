import { Test, TestingModule } from '@nestjs/testing';
import { OcowanService } from './ocowan.service';

describe('ContributionService', () => {
  let service: OcowanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OcowanService],
    }).compile();

    service = module.get<OcowanService>(OcowanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
