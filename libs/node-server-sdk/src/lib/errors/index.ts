class EnrollaError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class OrganizationIdNotSuppliedError extends Error {
  constructor() {
    super();
  }
}

export class FeatureNotFoundError extends Error {
  constructor() {
    super();
  }
}

export class CustomerFeatureNotFoundError extends Error {
  constructor() {
    super();
  }
}

export class FeatureTypeError extends Error {
  constructor() {
    super();
  }
}

export class InitilizationError extends EnrollaError {
  constructor(message: string) {
    super(message);
  }
}
