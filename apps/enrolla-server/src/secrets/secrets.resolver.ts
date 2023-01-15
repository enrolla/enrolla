import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLAuthGuard } from '../authz/graphql-auth.guard';
import { TenantId } from '../authz/tenant.decorator';
import { CreateSecretInput, UpdateSecretInput } from './dto';
import { Secret } from './entities/secret.entity';
import { SecretsService } from './secrets.service';

@Resolver(() => Secret)
@UseGuards(GraphQLAuthGuard)
export class SecretsResolver {
  constructor(private readonly secretsService: SecretsService) {}

  @Mutation(() => Secret)
  async createSecret(
    @TenantId() tenantId: string,
    @Args('input') createSecretInput: CreateSecretInput
  ) {
    return await this.secretsService.create(tenantId, createSecretInput);
  }

  @Mutation(() => Secret)
  updateSecret(
    @TenantId() tenantId: string,
    @Args('input') updateSecretInput: UpdateSecretInput
  ) {
    return this.secretsService.update(tenantId, updateSecretInput);
  }

  @Mutation(() => Secret)
  removeSecret(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.secretsService.remove(tenantId, id);
  }
}
