import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { FeatureInstanceByKeyInput } from '../../packages/dto/create-package.input';

@InputType()
export class UpdateCustomerByOrgIdInput extends PartialType(
  CreateCustomerInput
) {
  @Field(() => String)
  organizationId: string;

  @ApiProperty({
    type: FeatureInstanceByKeyInput,
    isArray: true,
    nullable: true,
  })
  @Field(() => [FeatureInstanceByKeyInput], { nullable: true })
  featuresByKey?: FeatureInstanceByKeyInput[];
}
