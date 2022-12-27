import { Resolver, Query, Args } from '@nestjs/graphql';
import { FeatureInstancesService } from './feature-instances.service';
import { FeatureInstance } from './entities/feature-instance.entity';
import { TenantId } from '../authz/tenant.decorator';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';

@Resolver(() => FeatureInstance)
@UseGuards(GraphQLJWTAuthGuard)
export class FeatureInstancesResolver {
  constructor(
    private readonly featureInstancesService: FeatureInstancesService
  ) {}

  @Query(() => [FeatureInstance], { name: 'featureInstances' })
  async findAll(@TenantId() tenantId: string) {
    return await this.featureInstancesService.findAll(tenantId);
  }

  @Query(() => FeatureInstance, { name: 'featureInstance' })
  async findOne(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return await this.featureInstancesService.findOne(id, tenantId);
  }
}
