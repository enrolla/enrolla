import { Test, TestingModule } from '@nestjs/testing';
import { FeatureInstancesService } from './feature-instances.service';

describe('FeatureInstancesService', () => {
  let service: FeatureInstancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureInstancesService],
    }).compile();

    service = module.get<FeatureInstancesService>(FeatureInstancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
