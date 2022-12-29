interface ConfigurationManager {
  getValue<T>(tenantId: string, key: string): Promise<T | null>;
}
