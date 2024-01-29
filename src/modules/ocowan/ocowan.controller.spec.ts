import { Test, TestingModule } from '@nestjs/testing';
import { OcowanController } from './ocowan.controller';

describe('ContributionController', () => {
  let controller: OcowanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcowanController],
    }).compile();

    controller = module.get<OcowanController>(OcowanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
