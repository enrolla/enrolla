import { initializeGraphQLClient } from '../api';
import { InitializeOptions } from '../interfaces';
import { refreshStore } from '../store';
import { InitializationError, PollingError } from '../errors';
import { validateConfiguration } from './validation';

export let _configuration: InitializeOptions;

const startPolling = (configuration: InitializeOptions) => {
  if (!configuration?.polling) return;
  const { enabled, intervalSeconds, onError } = configuration.polling;

  if (enabled) {
    setInterval(() => {
      refreshStore().catch((err) => {
        onError?.(new PollingError(err));
      });
    }, intervalSeconds * 1000);
  }
};

/**
 * Initializes the Enrolla SDK. Must be called once before any other SDK methods.
 *
 * @param options
 * @throws {InitializationError} if the configuration is invalid or if failed to fetch feature data.
 */
export const initialize = async (options: InitializeOptions) => {
  if (_configuration) {
    return;
  }

  validateConfiguration(options);
  _configuration = Object.freeze(options);

  initializeGraphQLClient(_configuration);
  startPolling(_configuration);

  try {
    await refreshStore();
  } catch (err) {
    throw new InitializationError(err.message, err as Error);
  }
};
