import { InputType, Field } from '@nestjs/graphql';
import { FeatureInstanceInput } from '../../packages/dto/create-package.input';
import { ApiProperty } from '@nestjs/swagger';
import { SecretInput } from '../../secrets/dto';

@InputType()
export class CreateCustomerInput {
  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => String, { nullable: true })
  createOrganizationName?: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  packageId?: string;

  @ApiProperty({ type: FeatureInstanceInput, isArray: true })
  @Field(() => [FeatureInstanceInput])
  features: FeatureInstanceInput[];

  @ApiProperty({ type: SecretInput, isArray: true, nullable: true })
  @Field(() => [SecretInput])
  secrets?: SecretInput[];
}
