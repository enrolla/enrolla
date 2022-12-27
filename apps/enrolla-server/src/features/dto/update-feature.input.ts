import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureInput } from './create-feature.input';
import { Field, InputType } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';

@InputType()
export class UpdateFeatureInput extends PartialType(CreateFeatureInput) {
  @Field(() => CuidResolver)
  id: string;
}
