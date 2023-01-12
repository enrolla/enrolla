import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../authz/graphql-auth.guard';
import { TenantId } from '../authz/tenant.decorator';
import { TenantsService } from './tenants.service';
import { ApiToken } from './entities/api-token.entity';
import { CreateApiTokenInput } from './dto/create-api-token.input';
import { Tenant } from './entities/tenant.entity';

@Resolver(() => Tenant)
@UseGuards(GraphQLAuthGuard)
export class TenantsResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Mutation(() => ApiToken)
  async createApiToken(
    @TenantId() tenantId: string,
    @Args('input') createApiTokenInput: CreateApiTokenInput
  ) {
    return await this.tenantsService.createApiToken(
      tenantId,
      createApiTokenInput
    );
  }

  @Mutation(() => ApiToken)
  async removeApiToken(@TenantId() tenantId: string, @Args('id') id: string) {
    return await this.tenantsService.deleteApiToken(tenantId, id);
  }

  @Query(() => [ApiToken])
  async apiTokens(@TenantId() tenantId: string) {
    return await this.tenantsService.getApiTokens(tenantId);
  }
}
