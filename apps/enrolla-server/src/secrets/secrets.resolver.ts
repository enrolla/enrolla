import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLAuthGuard } from '../authz/graphql-auth.guard';
import { TenantId } from '../authz/tenant.decorator';
import { CreateSecretKeyInput } from './dto';
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

  @Query(() => Boolean)
  async hasSecrets(@TenantId() tenantId: string) {
    return await this.secretsService.hasSecrets(tenantId);
  }

  @Mutation(() => SecretKey)
  async createSecretKey(
    @TenantId() tenantId: string,
    @Args('input') input: CreateSecretKeyInput
  ) {
    return await this.secretsService.createKey(tenantId, input);
  }

  @Mutation(() => SecretKey)
  removeSecretKey(
    @TenantId() tenantId: string,
    @Args('id', { type: () => String }) id: string
  ) {
    return this.secretsService.removeKey(tenantId, id);
  }
}
