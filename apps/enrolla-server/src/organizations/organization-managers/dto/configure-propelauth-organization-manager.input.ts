import { Field, InputType } from '@nestjs/graphql';
import { ConfigureOrganizationManagerInput } from '.';

@InputType()
export class ConfigurePropelauthOrganizationManagerInput extends ConfigureOrganizationManagerInput {
  @Field(() => String)
  apiKey: string;

  @Field(() => String)
  domain: string;
}
