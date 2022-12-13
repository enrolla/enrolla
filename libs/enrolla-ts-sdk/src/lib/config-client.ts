import axios from 'axios';

export class ConfigClient {
  private static BASE_URL =
    process.env['BASE_URL'] || 'https://api-staging.vecinity.io/';
  private static API_TOKEN = process.env['API_TOKEN'] || '';

  private static async fetchCustomerConfig(
    customerId: string,
    key: string
  ): Promise<unknown> {
    const response = await axios.get(
      `${ConfigClient.BASE_URL}/v1/customers/${customerId}/${key}`,
      { headers: { Authorization: `Bearer ${ConfigClient.API_TOKEN}` } }
    );
    return await response.data;
  }

  public static async get(customerId: string, key: string): Promise<unknown> {
    const config = await this.fetchCustomerConfig(customerId, key);

    return config;
  }
}
