import { FeatureType } from '@enrolla/graphql-codegen';

export const SEVERITY = {
  Warning: 'Warning',
  Error: 'Error',
  Critical: 'Critical',
} as const;

export type Severity = typeof SEVERITY[keyof typeof SEVERITY];

class EnrollaError extends Error {
  severity: Severity;

  constructor(message: string) {
    super(message);
  }
}

export class InitilizationError extends EnrollaError {
  readonly cause: Error | undefined;

  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.severity = SEVERITY.Critical;
  }
}

export class FeatureNotProvidedError extends EnrollaError {
  constructor() {
    super(`The "feature" argument is required and must be a string.`);
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
  constructor(feature: string, organizationId: string) {
    super(
      `The organizationId "${organizationId}" not found when attempting to evaluate feature "${feature}".`
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
  readonly cause: Error;

  constructor(cause: Error) {
    super('Failed to refresh feature data.');
    this.cause = cause;
    this.severity = SEVERITY.Warning;
  }
}
