import { initializeGraphQLClient, fetchAllCustomerData } from '../api';
import { InitializeOptions } from '../interfaces';
import { refreshStore } from '../store';
import { InitializationError, PollingError } from '../errors';
import { validateConfiguration } from './validation';
import { Customer } from '@enrolla/graphql-codegen';

export let _configuration: InitializeOptions;

const startPolling = (configuration: InitializeOptions) => {
  if (!configuration?.polling) return;
  const { enabled, intervalSeconds, onError } = configuration.polling;

  if (enabled) {
    setInterval(async () => {
      try {
        const { customers } = await fetchAllCustomerData();
        refreshStore(customers as Customer[]);
      } catch (err) {
        onError?.(new PollingError(err));
      }
    }, intervalSeconds * 1000);
  }
};

/**
 * Initializes the Enrolla SDK.
 * Must be called once before any other SDK methods.
 *
 * @param options - The options to initialize the SDK. See the {@link InitializeOptions} for details.
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
    const { customers } = await fetchAllCustomerData();
    refreshStore(customers as Customer[]);
  } catch (err) {
    throw new InitializationError(err.message, err as Error);
  }
};
