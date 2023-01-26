export const ORGANIZATION_MANAGER_TYPE = {
  NONE: 'NONE',
  AUTH0: 'AUTH0',
  PROPEL_AUTH: 'PROPEL_AUTH',
} as const;

export type OrganizationManagerType =
  typeof ORGANIZATION_MANAGER_TYPE[keyof typeof ORGANIZATION_MANAGER_TYPE];

export const ORGANIZATION_MANAGER_TYPE_CONFIGURATION_KEY =
  'organization_manager_type';

export const ORGANIZATION_MANAGER_CONFIGURATION_KEY =
  'organization_manager_configuration';

export const ORGANIZATION_MANAGER_SECRET_CONFIGURATION_KEY =
  'organization_manager_secret_configuration';
