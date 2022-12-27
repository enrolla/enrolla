import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageInput } from './create-package.input';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePackageInput extends PartialType(CreatePackageInput) {
  @Field(() => String)
  id: string;
}
