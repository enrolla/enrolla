import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PackagesService } from './packages.service';
import { Package } from './entities/package.entity';
// import { CreatePackageInput } from './dto/create-package.input';
// import { UpdatePackageInput } from './dto/update-package.input';
import { TenantId } from '../authz/tenant.decorator';
import { UseGuards } from '@nestjs/common';
import { GraphQLJWTAuthGuard } from '../authz/graphql-jwt-auth.guard';

@Resolver(() => Package)
@UseGuards(GraphQLJWTAuthGuard)
export class PackagesResolver {
  constructor(private readonly packagesService: PackagesService) {}

  // @Mutation(() => Package)
  // createPackage(@Args('createPackageInput') createPackageInput: CreatePackageInput) {
  //   return this.packagesService.create(createPackageInput);
  // }

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

  // @Mutation(() => Package)
  // updatePackage(@Args('updatePackageInput') updatePackageInput: UpdatePackageInput) {
  //   return this.packagesService.update(updatePackageInput.id, updatePackageInput);
  // }

  // @Mutation(() => Package)
  // removePackage(@Args('id', { type: () => Int }) id: number) {
  //   return this.packagesService.remove(id);
  // }
}
