import { Secret } from './entities/secret.entity';

export interface SecretManager {
  getValue(
    tenantId: string,
    customerId: string,
    key: string
  ): Promise<string | null>;

  getMulti(
    tenantId: string,
    customerId: string,
    keys: string[]
  ): Promise<Secret[]>;

  setValue(
    tenantId: string,
    customerId: string,
    key: string,
    value: string
  ): Promise<Secret | null>;

  delete(tenantId: string, customerId: string, key: string): Promise<void>;
}
