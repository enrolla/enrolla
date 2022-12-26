import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureInput } from './create-feature.input';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateFeatureInput extends PartialType(CreateFeatureInput) {
  @Field(() => String)
  id: string;
}
