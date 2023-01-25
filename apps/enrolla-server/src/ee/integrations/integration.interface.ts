export interface Integration {
  isEnabled(tenantId: string): Promise<boolean>;
  isConfigured(tenantId: string): Promise<boolean>;
}

export enum IntegrationType {
  Auth0,
  PropelAuth,
}
