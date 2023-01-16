import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLAuthGuard } from '../authz/graphql-auth.guard';
import { TenantId } from '../authz/tenant.decorator';
import { CreateSecretInput, UpdateSecretInput } from './dto';
import { SecretKey } from './entities';
import { Secret } from './entities/secret.entity';
import { SecretsService } from './secrets.service';

@Resolver(() => Secret)
@UseGuards(GraphQLAuthGuard)
export class SecretsResolver {
  constructor(private readonly secretsService: SecretsService) {}

  @Query(() => [SecretKey])
  async secretKeys(@TenantId() tenantId: string) {
    return await this.secretsService.findAllKeysForTennant(tenantId);
  }

  @Mutation(() => Secret)
  async createSecret(
    @TenantId() tenantId: string,
    @Args('input') createSecretInput: CreateSecretInput
  ) {
    return await this.secretsService.createSecret(tenantId, createSecretInput);
  }

  @Mutation(() => Secret)
  updateSecret(
    @TenantId() tenantId: string,
    @Args('input') updateSecretInput: UpdateSecretInput
  ) {
    return this.secretsService.updateSecret(tenantId, updateSecretInput);
  }

  @Mutation(() => Secret)
  removeSecret(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.secretsService.removeSecret(tenantId, id);
  }

  @Mutation(() => SecretKey)
  async createSecretKey(
    @TenantId() tenantId: string,
    @Args('key', { type: () => String }) key: string
  ) {
    return await this.secretsService.createKey(tenantId, key);
  }

  @Mutation(() => SecretKey)
  removeSecretKey(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.secretsService.removeKey(tenantId, id);
  }
}
