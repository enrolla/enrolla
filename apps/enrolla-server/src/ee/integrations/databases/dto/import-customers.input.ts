import { Field, InputType } from '@nestjs/graphql';
import { FeatureMappingInput } from './feature-mapping.input';

@InputType()
export class ImportCustomersInput {
  @Field(() => String)
  organizationIdField: string;

  @Field(() => String)
  customerNameField: string;

  @Field(() => [String])
  organizationIds: string[];

  @Field(() => [FeatureMappingInput])
  features: FeatureMappingInput[];
}
