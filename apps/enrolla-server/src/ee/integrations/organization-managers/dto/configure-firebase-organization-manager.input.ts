import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ConfigureFirebaseOrganizationManagerInput {
  @Field(() => String)
  projectId: string;

  @Field(() => String)
  clientEmail: string;

  @Field(() => String)
  privateKey: string;
}
