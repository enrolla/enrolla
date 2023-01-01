import { ObjectType, Field } from '@nestjs/graphql';
import { Feature } from '../../features/entities/feature.entity';
import { Package } from '../../packages/entities/package.entity';
import { GraphQLJSON, CuidResolver } from 'graphql-scalars';
import { Customer } from '../../customers/entities/customer.entity';

@ObjectType()
export class FeatureInstance {
  @Field(() => CuidResolver)
  id: string;

  @Field(() => String)
  tenantId: string;

  @Field(() => CuidResolver)
  featureId: string;

  @Field(() => Feature)
  feature: Feature;

  @Field(() => CuidResolver, { nullable: true })
  packageId: string;

  @Field(() => Package, { nullable: true })
  package: Package;

  @Field(() => CuidResolver, { nullable: true })
  customerId: string;

  @Field(() => Customer, { nullable: true })
  customer: Customer;

  @Field(() => GraphQLJSON)
  value: object;

  @Field(() => Date)
  createdAt: Date;
}
