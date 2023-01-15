import { Test, TestingModule } from '@nestjs/testing';
import { ApiTokenService } from './service';

describe('ApiTokenService', () => {
  let service: ApiTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiTokenService],
    }).compile();

    service = module.get<ApiTokenService>(ApiTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
