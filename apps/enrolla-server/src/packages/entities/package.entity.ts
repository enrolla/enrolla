import { ObjectType, Field } from '@nestjs/graphql';
import { FeatureInstance } from '../../feature-instances/entities/feature-instance.entity';

@ObjectType()
export class Package {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Package, { nullable: true })
  parentPackage?: Package;

  @Field(() => [FeatureInstance])
  featuresInstances: [FeatureInstance];

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  createdAt: Date;
}
