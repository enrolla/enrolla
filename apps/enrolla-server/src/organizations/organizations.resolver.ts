import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrganizationsService } from './organizations.service';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { TenantId } from '../authz/tenant.decorator';
import { GraphQLAuthGuard } from '../authz/graphql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Organization)
@UseGuards(GraphQLAuthGuard)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Mutation(() => Organization)
  createOrganization(
    @TenantId() tenantId: string,
    @Args('input')
    createOrganizationInput: CreateOrganizationInput
  ) {
    return this.organizationsService.create(createOrganizationInput, tenantId);
  }

  @Query(() => [Organization], { name: 'organizations' })
  findAll(@TenantId() tenantId: string) {
    return this.organizationsService.findAll(tenantId);
  }

  @Query(() => Organization, { name: 'organization' })
  findOne(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.organizationsService.findOne(id, tenantId);
  }

  @Mutation(() => Organization)
  updateOrganization(
    @TenantId() tenantId: string,
    @Args('input')
    updateOrganizationInput: UpdateOrganizationInput
  ) {
    return this.organizationsService.update(
      updateOrganizationInput.id,
      updateOrganizationInput,
      tenantId
    );
  }

  @Mutation(() => Organization)
  removeOrganization(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.organizationsService.remove(id, tenantId);
  }
}
