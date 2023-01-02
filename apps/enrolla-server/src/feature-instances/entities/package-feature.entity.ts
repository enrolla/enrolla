import { ObjectType, Field } from '@nestjs/graphql';
import { Package } from '../../packages/entities/package.entity';
import { CuidResolver } from 'graphql-scalars';
import { FeatureInstance } from './feature-instance.entity';

@ObjectType()
export class PackageFeature extends FeatureInstance {
  @Field(() => CuidResolver)
  packageId: string;

  @Field(() => Package)
  package: Package;
}
