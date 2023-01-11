import { Field, ObjectType } from '@nestjs/graphql';
import { ApiToken } from './api-token.entity';

@ObjectType()
export class Tenant {
  @Field(() => [ApiToken])
  apiTokens: ApiToken[];
}
