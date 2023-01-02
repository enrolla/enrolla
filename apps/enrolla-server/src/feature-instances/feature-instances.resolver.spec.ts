import { Test, TestingModule } from '@nestjs/testing';
import { FeatureInstancesResolver } from './package-features.resolver';
import { FeatureInstancesService } from './feature-instances.service';

describe('FeatureInstancesResolver', () => {
  let resolver: FeatureInstancesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureInstancesResolver, FeatureInstancesService],
    }).compile();

    resolver = module.get<FeatureInstancesResolver>(FeatureInstancesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
