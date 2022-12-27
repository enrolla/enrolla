import { Test, TestingModule } from '@nestjs/testing';
import { FeaturesResolver } from './features.resolver';
import { FeaturesService } from './features.service';

describe('FeaturesResolver', () => {
  let resolver: FeaturesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeaturesResolver, FeaturesService],
    }).compile();

    resolver = module.get<FeaturesResolver>(FeaturesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
