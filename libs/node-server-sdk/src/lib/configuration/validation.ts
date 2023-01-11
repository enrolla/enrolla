import { InitialzeOptions } from '../interfaces';
import { InitilizationError } from '../errors';

export const validateConfiguration = (options: InitialzeOptions): void => {
  const { apiToken, polling, evaluationHooks } = options;
  if (!apiToken) {
    throw new InitilizationError('"apiToken" is required');
  }

  if (typeof apiToken !== 'string') {
    throw new InitilizationError('"apiToken" must be a string');
  }

  if (polling) {
    const { enabled, intervalSeconds, onError } = polling;

    if (typeof enabled !== 'boolean') {
      throw new InitilizationError('"polling.enabled" must be a boolean.');
    }
    if (typeof intervalSeconds !== 'number' || intervalSeconds <= 0) {
      throw new InitilizationError(
        '"polling.intervalSeconds" must be an integer greater than 0.'
      );
    }
    if (onError && typeof onError !== 'function') {
      throw new InitilizationError('"polling.onError" must be a function.');
    }
  }

  if (
    evaluationHooks?.beforeEvaluation &&
    typeof evaluationHooks.beforeEvaluation !== 'function'
  ) {
    throw new InitilizationError(
      '"evaluationHooks.beforeEvaluation" must be a function.'
    );
  }

  if (
    evaluationHooks?.afterEvaluation &&
    typeof evaluationHooks.afterEvaluation !== 'function'
  ) {
    throw new InitilizationError(
      '"evaluationHooks.afterEvaluation" must be a function.'
    );
  }
};
