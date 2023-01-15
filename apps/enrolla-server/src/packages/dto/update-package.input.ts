import { CreatePackageInput } from './create-package.input';
import {
  Field,
  InputType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';
import { PackageUpdateStrategy } from '../update-strategies/strategies';

registerEnumType(PackageUpdateStrategy, { name: 'PackageUpdateStrategy' });

@InputType()
export class UpdatePackageInput extends PartialType(CreatePackageInput) {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => PackageUpdateStrategy, { nullable: true })
  updateStrategy?: PackageUpdateStrategy;
}
