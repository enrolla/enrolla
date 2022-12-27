import { ObjectType, Field } from '@nestjs/graphql';
import { Feature } from '../../features/entities/feature.entity';
import { Package } from '../../packages/entities/package.entity';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType()
export class FeatureInstance {
  @Field(() => String)
  id: string;

  @Field(() => Feature)
  feature: Feature;

  @Field(() => Package)
  package: Package;

  @Field(() => GraphQLJSON)
  value: object;

  @Field(() => Date)
  createdAt: Date;
}
