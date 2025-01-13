import { Test, TestingModule } from '@nestjs/testing';
import { EmotifyService } from './emotify.service';

describe('EmotifyService', () => {
  let service: EmotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmotifyService],
    }).compile();

    service = module.get<EmotifyService>(EmotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
