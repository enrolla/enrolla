import { ObjectType, Field } from '@nestjs/graphql';
import {
  Feature,
  FeatureValueUnion,
} from '../../features/entities/feature.entity';
import { Package } from '../../packages/entities/package.entity';

@ObjectType()
export class FeatureInstance {
  @Field(() => String)
  id: string;

  @Field(() => Feature)
  feature: Feature;

  @Field(() => Package)
  package: Package;

  @Field(() => FeatureValueUnion)
  value: typeof FeatureValueUnion;

  @Field(() => Date)
  createdAt: Date;
}
