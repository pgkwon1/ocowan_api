import { Test, TestingModule } from '@nestjs/testing';
import { BigthreeService } from './bigthree.service';

describe('BigthreeService', () => {
  let service: BigthreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BigthreeService],
    }).compile();

    service = module.get<BigthreeService>(BigthreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
