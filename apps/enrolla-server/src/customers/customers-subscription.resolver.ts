import { Inject } from '@nestjs/common';
import {
    Resolver,
    Mutation,
    Subscription,
    ResolveField,
    Parent,
  } from '@nestjs/graphql';
  import { PubSub } from 'graphql-subscriptions';
import { FeatureValue } from '../feature-instances/entities/feature-value.entity';
import { Secret } from '../secrets/entities';
import { SecretsService } from '../secrets/secrets.service';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CustomerForSubscription } from './entities/customer-for-subscription.entity';
    
  @Resolver(() => CustomerForSubscription)
  export class CustomerSubscriptionsResolver {
    constructor(
        @Inject('PUB_SUB') private pubSub: PubSub
    ) {}
  

    @Subscription(() => CustomerForSubscription, {
        resolve (payload: CustomerForSubscription) {
            return payload;
        },
        filter: (payload, variables) => {


        // console.log('payload', payload)
        // console.log('variables', variables)

        // payload.effectiveConfiguration.forEach((featureValue: FeatureValue) => {
        //     console.log('featureValue', featureValue);
        // })

        return true;
        }
        
    })
    customerUpdated(
    ) {
      console.log('tenantId none')
      return this.pubSub.asyncIterator('customerUpdated');
    }
  }
  