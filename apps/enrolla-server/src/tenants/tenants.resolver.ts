import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../authz/graphql-auth.guard';
import { TenantId } from '../authz/tenant.decorator';
import { ApiTokenService } from './api-tokens/service';
import { ApiToken } from './api-tokens/entities/api-token.entity';
import { CreateApiTokenInput } from './api-tokens/dto/create-api-token.input';
import { EncryptionKeyService } from './encryption-keys/servce';
import { Tenant } from './tenant.entity';
import { EncryptionKey } from './encryption-keys/entities';
import { CreateEncryptionKeyInput } from './encryption-keys/dto';

@Resolver(() => Tenant)
@UseGuards(GraphQLAuthGuard)
export class TenantsResolver {
  constructor(
    private readonly apiTokenService: ApiTokenService,
    private readonly encryptionKeyService: EncryptionKeyService
  ) {}

  @Mutation(() => ApiToken)
  async createApiToken(
    @TenantId() tenantId: string,
    @Args('input') createApiTokenInput: CreateApiTokenInput
  ) {
    return await this.apiTokenService.create(tenantId, createApiTokenInput);
  }

  @Mutation(() => ApiToken)
  async removeApiToken(@TenantId() tenantId: string, @Args('id') id: string) {
    return await this.apiTokenService.delete(tenantId, id);
  }

  @Query(() => [ApiToken])
  async apiTokens(@TenantId() tenantId: string) {
    return await this.apiTokenService.getAllForTennant(tenantId);
  }

  @Mutation(() => EncryptionKey)
  async createEncryptionKey(
    @TenantId() tenantId: string,
    @Args('input') createEncryptionKeyInput: CreateEncryptionKeyInput
  ) {
    return await this.encryptionKeyService.create(
      tenantId,
      createEncryptionKeyInput
    );
  }

  @Mutation(() => EncryptionKey)
  async removeEncryptionKey(
    @TenantId() tenantId: string,
    @Args('id') id: string
  ) {
    return await this.encryptionKeyService.delete(tenantId);
  }

  @Query(() => [EncryptionKey])
  async encryptionKeys(@TenantId() tenantId: string) {
    const key = await this.encryptionKeyService.getTennantEncryptionKey(
      tenantId
    );

    return key ? [key] : [];
  }

  @Query(() => EncryptionKey, { nullable: true })
  async encryptionKey(@TenantId() tenantId: string) {
    return await this.encryptionKeyService.getTennantEncryptionKey(tenantId);
  }
}
