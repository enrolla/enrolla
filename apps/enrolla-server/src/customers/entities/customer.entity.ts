import { ObjectType, Field } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';
import { Package } from '../../packages/entities/package.entity';
import { CustomerFeature } from '../../feature-instances/entities/customer-feature.entity';
import { FeatureValue } from '../../feature-instances/entities/feature-value.entity';

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

  @Field(() => [CustomerFeature])
  features: CustomerFeature[];

  @Field(() => [FeatureValue])
  effectiveConfiguration: FeatureValue[];

  @Field(() => Date)
  createdAt: Date;
}
