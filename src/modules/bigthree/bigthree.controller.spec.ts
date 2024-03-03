import { Test, TestingModule } from '@nestjs/testing';
import { BigthreeController } from './bigthree.controller';

describe('BigthreeController', () => {
  let controller: BigthreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BigthreeController],
    }).compile();

    controller = module.get<BigthreeController>(BigthreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
