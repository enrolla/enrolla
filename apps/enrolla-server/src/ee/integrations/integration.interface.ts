export interface Integration {
  isEnabled(tenantId: string): Promise<boolean>;
  isConfigured(tenantId: string): Promise<boolean>;
}

export const INTEGRATION_TYPE = {
  Auth0: 'Auth0',
  PropelAuth: 'PropelAuth',
  Firebase: 'Firebase',
} as const;

export type IntegrationType =
  typeof INTEGRATION_TYPE[keyof typeof INTEGRATION_TYPE];
