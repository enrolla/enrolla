import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PackagesService } from './packages.service';
import { Package } from './entities/package.entity';
import { TenantId } from '../authz/tenant.decorator';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';
import { CreatePackageInput } from './dto/create-package.input';
import { UpdatePackageInput } from './dto/update-package.input';
import { FeatureInstance } from '../feature-instances/entities/feature-instance.entity';
import { FeatureInstancesService } from '../feature-instances/feature-instances.service';
import { PackageFeature } from '../feature-instances/entities/package-feature.entity';

@Resolver(() => Package)
@UseGuards(GraphQLJWTAuthGuard)
export class PackagesResolver {
  constructor(
    private readonly packagesService: PackagesService,
    private readonly featuresInstancesService: FeatureInstancesService
  ) {}

  @Mutation(() => Package)
  createPackage(
    @TenantId() tenantId: string,
    @Args('input') createPackageInput: CreatePackageInput
  ) {
    return this.packagesService.create(createPackageInput, tenantId);
  }

  @Query(() => [Package], { name: 'packages' })
  findAll(@TenantId() tenantId: string) {
    return this.packagesService.findAll(tenantId);
  }

  @Query(() => Package, { name: 'package' })
  findOne(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.packagesService.findOne(id, tenantId);
  }

  @Mutation(() => Package)
  updatePackage(
    @TenantId() tenantId: string,
    @Args('input') updatePackageInput: UpdatePackageInput
  ) {
    return this.packagesService.update(
      updatePackageInput.id,
      updatePackageInput,
      tenantId
    );
  }

  @Mutation(() => Package)
  removePackage(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.packagesService.remove(id, tenantId);
  }

  @ResolveField(() => Package, { nullable: true })
  async parentPackage(@Parent() packagez: Package) {
    const { parentPackageId, tenantId } = packagez;

    return (
      parentPackageId && this.packagesService.findOne(parentPackageId, tenantId)
    );
  }

  @ResolveField(() => [PackageFeature])
  async features(@Parent() packagez: Package) {
    const { id, tenantId } = packagez;

    return this.featuresInstancesService.findByPackageId(id, tenantId);
  }
}
