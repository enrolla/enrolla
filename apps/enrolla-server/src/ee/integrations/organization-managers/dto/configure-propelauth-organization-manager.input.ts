import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ConfigurePropelauthOrganizationManagerInput {
  @Field(() => String)
  apiKey: string;

  @Field(() => String)
  domain: string;
}
