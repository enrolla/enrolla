import { InputType, Field } from '@nestjs/graphql';
import { FeatureInstanceInput } from '../../packages/dto/create-package.input';
import { ApiProperty } from '@nestjs/swagger';
import { NotContains } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => String)
  @NotContains(' ')
  name: string;

  @Field(() => String, { nullable: true })
  packageId?: string;

  @ApiProperty({ type: FeatureInstanceInput, isArray: true })
  @Field(() => [FeatureInstanceInput])
  features: FeatureInstanceInput[];
}
