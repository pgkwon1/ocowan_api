import { Test, TestingModule } from '@nestjs/testing';
import { EmotifyService } from './emotify.service';
import { EmotifyController } from './emotify.controller';
import { JwtEntity } from 'src/modules/auth/entities/jwt.entity';
import { JwtStrateGy } from 'src/modules/auth/jwt.strategy';

describe('EmotifyService', () => {
  let controller: EmotifyController;
  let mockToken: JwtEntity;
  let jwtStrateGy: JwtStrateGy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmotifyService],
    }).compile();

    mockToken = {
      login: 'testuser',
      id: '12345',
      github_id: 'test_github_id',
    };
    controller = module.get<EmotifyController>(EmotifyController);
    jwtStrateGy = module.get<JwtStrateGy>(JwtStrateGy);
  });
  beforeEach(() => {});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
