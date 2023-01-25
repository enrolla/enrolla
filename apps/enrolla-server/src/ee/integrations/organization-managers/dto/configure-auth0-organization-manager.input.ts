import { Field, InputType } from '@nestjs/graphql';
import { ConfigureOrganizationManagerInput } from '.';

@InputType()
export class ConfigureAuth0OrganizationManagerInput extends ConfigureOrganizationManagerInput {
  @Field(() => String)
  clientId: string;

  @Field(() => String)
  clientSecret: string;

  @Field(() => String)
  domain: string;
}
