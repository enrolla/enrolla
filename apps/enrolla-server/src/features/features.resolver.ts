import {
  Resolver,
  Query,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { FeaturesService } from './features.service';
import { Feature } from './entities/feature.entity';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { TenantId } from '../authz/tenant.decorator';
import { CreateFeatureInput } from './dto/create-feature.input';
import { UpdateFeatureInput } from './dto/update-feature.input';

@Resolver(() => Feature)
@UseGuards(GraphQLJWTAuthGuard)
export class FeaturesResolver {
  constructor(private readonly featuresService: FeaturesService) {}

  @Mutation(() => Feature)
  createFeature(
    @TenantId() tenantId: string,
    @Args('createFeatureInput') createFeatureInput: CreateFeatureInput
  ) {
    return this.featuresService.create(createFeatureInput, tenantId);
  }

  @Query(() => [Feature], { name: 'features' })
  findAll(@TenantId() tenantId: string) {
    return this.featuresService.findAll(tenantId);
  }

  @Query(() => Feature, { name: 'feature' })
  findOne(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.featuresService.findOne(id, tenantId);
  }

  @Mutation(() => Feature)
  updateFeature(
    @TenantId() tenantId: string,
    @Args('updateFeatureInput') updateFeatureInput: UpdateFeatureInput
  ) {
    return this.featuresService.update(
      updateFeatureInput.id,
      updateFeatureInput,
      tenantId
    );
  }

  @Mutation(() => Feature)
  removeFeature(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.featuresService.remove(id, tenantId);
  }
}
