export interface ConfigurationManager {
  getValue<T>(tenantId: string, key: string): Promise<T | undefined>;

  getSecretValue(tenantId: string, key: string): Promise<string | undefined>;
}
