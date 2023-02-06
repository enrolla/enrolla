import { Inject } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CustomerForSubscription } from './entities/customer-for-subscription.entity';

@Resolver(() => CustomerForSubscription)
export class CustomerSubscriptionsResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub) {}

  @Subscription(() => CustomerForSubscription, {
    filter: (payload, _variables, context) => {
      const requestTenantId = context.tenantId; // see onConnect function for implementation
      const customerTenantId = payload.customerUpdated.tenantId;

      return customerTenantId === requestTenantId;
    },
  })
  customerUpdated() {
    return this.pubSub.asyncIterator('customerUpdated');
  }
}
