import { Test, TestingModule } from '@nestjs/testing';
import { TilService } from './til.service';

describe('TilService', () => {
  let service: TilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TilService],
    }).compile();

    service = module.get<TilService>(TilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
