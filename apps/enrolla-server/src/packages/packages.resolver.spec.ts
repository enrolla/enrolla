import { Test, TestingModule } from '@nestjs/testing';
import { PackagesResolver } from './packages.resolver';
import { PackagesService } from './packages.service';

describe('PackagesResolver', () => {
  let resolver: PackagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagesResolver, PackagesService],
    }).compile();

    resolver = module.get<PackagesResolver>(PackagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
