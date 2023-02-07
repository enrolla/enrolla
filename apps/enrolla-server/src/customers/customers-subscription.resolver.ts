import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSubService } from '../pubsub/pubsub.service';
import { CustomerForSubscription } from './entities/customer-for-subscription.entity';

@Resolver(() => CustomerForSubscription)
export class CustomerSubscriptionsResolver {
  constructor(private readonly pubSubService: PubSubService) {}

  @Subscription(() => CustomerForSubscription, {
    filter: (payload, _variables, context) => {
      const requestTenantId = context.tenantId; // see onConnect function for implementation
      const customerTenantId = payload.customerUpdated.tenantId;

      return customerTenantId === requestTenantId;
    },
  })
  customerUpdated() {
    return this.pubSubService.pubSub.asyncIterator('customerUpdated');
  }
}
