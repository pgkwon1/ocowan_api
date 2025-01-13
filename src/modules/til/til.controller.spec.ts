import { Test, TestingModule } from '@nestjs/testing';
import { TilController } from './til.controller';

describe('TilController', () => {
  let controller: TilController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TilController],
    }).compile();

    controller = module.get<TilController>(TilController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
