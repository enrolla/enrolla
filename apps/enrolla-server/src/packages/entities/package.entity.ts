import { ObjectType, Field } from '@nestjs/graphql';
import { FeatureInstance } from '../../feature-instances/entities/feature-instance.entity';
import { CuidResolver, SemVerResolver } from 'graphql-scalars';

@ObjectType()
export class Package {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  tenantId: string;

  @Field(() => Package, { nullable: true })
  parentPackage?: Package;

  @Field(() => CuidResolver, { nullable: true })
  parentPackageId?: string;

  @Field(() => String)
  name: string;

  @Field(() => SemVerResolver)
  version: string;

  @Field(() => [FeatureInstance])
  featuresInstances: FeatureInstance[];

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  createdAt: Date;
}
