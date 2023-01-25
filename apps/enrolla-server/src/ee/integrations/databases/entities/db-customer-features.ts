import { DBCustomer } from './db-customer.entity';
import { DBFeature } from './db-feature.entity';

export class DBCustomerFeatures extends DBCustomer {
  features: DBFeature[];

  constructor(organizationId: string, name: string, features: DBFeature[]) {
    super(organizationId, name);

    this.features = features;
  }
}
