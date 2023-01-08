import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../../authz/graphql-jwt-auth.guard';
import { FeaturesService } from '../../features/features.service';
import { Feature } from '../../features/entities/feature.entity';
import { FeatureValue } from '../entities/feature-value.entity';
import { TenantId } from '../../authz/tenant.decorator';
import * as DataLoader from 'dataloader';
import { Loader } from '../../dataloader.interceptor';
import { FeaturesLoader } from '../../features/features.loader';

@Resolver(() => FeatureValue)
@UseGuards(GraphQLJWTAuthGuard)
export class FeatureValuesResolver {
  constructor(private readonly featuresService: FeaturesService) {}

  @ResolveField(() => Feature)
  async feature(
    @TenantId() tenantId: string,
    @Parent() featureValue: FeatureValue,
    @Loader(FeaturesLoader) featureLoader: DataLoader<string, Feature>
  ) {
    const { featureId } = featureValue;

    return featureLoader.load(featureId);
  }
}
