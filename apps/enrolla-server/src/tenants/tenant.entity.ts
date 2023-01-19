import { Field, ObjectType } from '@nestjs/graphql';
import { ApiToken } from './api-tokens/entities/api-token.entity';

@ObjectType()
export class Tenant {
  @Field(() => [ApiToken])
  apiTokens: ApiToken[];

  @Field(() => String)
  publicEncryptionKey?: string;
}
