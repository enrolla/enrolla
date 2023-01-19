export interface ConfigurationManager {
  getValue<T>(tenantId: string, key: string): T | undefined;

  getSecretValue(tenantId: string, key: string): string | undefined;
}
