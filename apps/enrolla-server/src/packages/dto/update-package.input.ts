import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageInput } from './create-package.input';
import { Field, InputType } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';

@InputType()
export class UpdatePackageInput extends PartialType(CreatePackageInput) {
  @Field(() => CuidResolver)
  id: string;
}
