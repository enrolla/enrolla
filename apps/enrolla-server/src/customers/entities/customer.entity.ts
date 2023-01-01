import { ObjectType, Field } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';
import { FeatureInstance } from '../../feature-instances/entities/feature-instance.entity';
import { Package } from '../../packages/entities/package.entity';

@ObjectType()
export class Customer {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  tenantId: string;

  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => String)
  name: string;

  @Field(() => Package, { nullable: true })
  package?: Package;

  @Field(() => String, { nullable: true })
  packageId?: string;

  @Field(() => [FeatureInstance])
  features: FeatureInstance[];

  @Field(() => Date)
  createdAt: Date;
}
