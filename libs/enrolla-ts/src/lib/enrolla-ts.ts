import axios from 'axios';

export class ConfigClient {
  private static baseUrl = 'https://api-staging.vecinity.io/';

  // Cache for storing customer config data
  private static cache: Map<string, unknown> = new Map<string, unknown>();

  private static async fetchCustomerConfig(
    customerId: string,
    key: string
  ): Promise<unknown> {
    const response = await axios.get(
      `${ConfigClient.baseUrl}/v1/customers/${customerId}/${key}`
    );
    return await response.data;
  }

  public static async get(customerId: string, key: string): Promise<unknown> {
    if (this.cache.has(customerId)) {
      return this.cache.get(customerId);
    }

    const config = await this.fetchCustomerConfig(customerId, key);

    this.cache.set(customerId, config);

    return config;
  }
}
