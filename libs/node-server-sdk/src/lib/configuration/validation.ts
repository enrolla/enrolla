import { InitializeOptions } from '../interfaces';
import { InitializationError } from '../errors';

export const validateConfiguration = (options: InitializeOptions): void => {
  const { apiToken, polling, evaluationHooks } = options;
  if (!apiToken) {
    throw new InitializationError('"apiToken" is required');
  }

  if (typeof apiToken !== 'string') {
    throw new InitializationError('"apiToken" must be a string');
  }

  if (polling) {
    const { enabled, intervalSeconds, onError } = polling;

    if (typeof enabled !== 'boolean') {
      throw new InitializationError('"polling.enabled" must be a boolean.');
    }
    if (typeof intervalSeconds !== 'number' || intervalSeconds <= 0) {
      throw new InitializationError(
        '"polling.intervalSeconds" must be an integer greater than 0.'
      );
    }
    if (onError && typeof onError !== 'function') {
      throw new InitializationError('"polling.onError" must be a function.');
    }
  }

  if (
    evaluationHooks?.beforeEvaluation &&
    typeof evaluationHooks.beforeEvaluation !== 'function'
  ) {
    throw new InitializationError(
      '"evaluationHooks.beforeEvaluation" must be a function.'
    );
  }

  if (
    evaluationHooks?.afterEvaluation &&
    typeof evaluationHooks.afterEvaluation !== 'function'
  ) {
    throw new InitializationError(
      '"evaluationHooks.afterEvaluation" must be a function.'
    );
  }
};
