import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ConfigureAuth0OrganizationManagerInput {
  @Field(() => String)
  clientId: string;

  @Field(() => String)
  clientSecret: string;

  @Field(() => String)
  domain: string;
}
