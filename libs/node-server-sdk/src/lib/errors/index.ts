import { FeatureType } from '@enrolla/graphql-codegen';

/**
 * The severity of an error.
 */
export const SEVERITY = {
  Warning: 'Warning',
  Error: 'Error',
  Critical: 'Critical',
} as const;

export type Severity = typeof SEVERITY[keyof typeof SEVERITY];

/**
 * Base class for all Enrolla errors.
 */
export class EnrollaError extends Error {
  /**
   * The severity of the error.
   */
  severity: Severity;
  /**
   * The underlying cause of the error.
   */
  cause?: Error;

  constructor(message: string) {
    super(message);
  }
}

export class NotInitializedError extends EnrollaError {
  constructor() {
    super(
      `The Enrolla SDK must be initialized by calling the "initialize" function prior to use.`
    );
    this.severity = SEVERITY.Critical;
  }
}

export class InitializationError extends EnrollaError {
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Failed to initialize Enrolla SDK');
    this.cause = cause;
    this.severity = SEVERITY.Critical;
  }
}

export class ArgumentNotProvidedError extends EnrollaError {
  constructor(argumentName: string) {
    super(`The "${argumentName}" argument is required and must be a string.`);
    this.severity = SEVERITY.Error;
  }
}

export class OrganizationIdNotProvidedError extends EnrollaError {
  constructor() {
    super(`The "organizationId" argument is required and must be a string.`);
    this.severity = SEVERITY.Error;
  }
}

export class OrganizationNotFoundError extends EnrollaError {
  constructor(key: string, organizationId: string) {
    super(
      `The organizationId "${organizationId}" was not found when attempting to evaluate "${key}".`
    );
    this.severity = SEVERITY.Error;
  }
}

export class FeatureNotFoundError extends EnrollaError {
  constructor(feature: string) {
    super(`The feature "${feature}" not found.`);
    this.severity = SEVERITY.Error;
  }
}

export class SecretNotFoundError extends EnrollaError {
  constructor(key: string) {
    super(`The secret "${key}" was not found.`);
    this.severity = SEVERITY.Error;
  }
}

export class FeatureTypeMismatchError extends EnrollaError {
  constructor(
    feature: string,
    expectedType: FeatureType,
    actualType: FeatureType
  ) {
    super(
      `Attempted to evaluate feature "${feature}" as type "${expectedType}", but it is defined as type "${actualType}".`
    );
    this.severity = SEVERITY.Error;
  }
}

export class PollingError extends EnrollaError {
  constructor(cause: Error) {
    super('Failed to refresh feature data.');
    this.cause = cause;
    this.severity = SEVERITY.Warning;
  }
}

export class SecretDecryptError extends EnrollaError {
  constructor(key: string, cause: Error) {
    super(`Failed to decrypt secret "${key}".`);
    this.cause = cause;
    this.severity = SEVERITY.Critical;
  }
}

export class PrivateKeyNotSuppliedError extends EnrollaError {
  constructor() {
    super(
      'You must supply a "privateKey" to the "initialize" function in order to use secrets. See the documentation for more information.'
    );
    this.severity = SEVERITY.Error;
  }
}

export class DataPushError extends EnrollaError {
  constructor(message: string, error?: Error) {
    super(`Error getting push data from server: ${message}`);
    this.severity = SEVERITY.Warning;
    this.cause = error;
  }
}
