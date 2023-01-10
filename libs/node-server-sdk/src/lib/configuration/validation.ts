import { InitialzeOptions } from '../interfaces';
import { InitilizationError } from '../errors';

export const validateConfiguration = (options: InitialzeOptions): void => {
  if (!options.apiToken) {
    throw new InitilizationError('"apiToken" is required');
  }

  if (typeof options.apiToken !== 'string') {
    throw new InitilizationError('"apiToken" must be a string');
  }

  if (options.pollingEnabled) {
    if (
      typeof options.pollIntervalSeconds !== 'number' ||
      options.pollIntervalSeconds <= 0
    ) {
      throw new InitilizationError(
        'when polling is enabled, "pollIntervalSeconds" must be a number greater than 0'
      );
    }
  }
};
