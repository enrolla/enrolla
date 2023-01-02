import { ObjectType, Field } from '@nestjs/graphql';
import { CuidResolver } from 'graphql-scalars';
import { Customer } from '../../customers/entities/customer.entity';
import { FeatureInstance } from './feature-instance.entity';

@ObjectType()
export class CustomerFeature extends FeatureInstance {
  @Field(() => CuidResolver)
  customerId: string;

  @Field(() => Customer)
  customer: Customer;
}
