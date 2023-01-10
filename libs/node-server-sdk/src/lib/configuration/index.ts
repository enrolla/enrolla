import { initializeGraphQLClient } from '../api';
import { InitialzeOptions } from '../interfaces';
import { refreshStore } from '../store';
import { InitilizationError } from '../errors';
import { validateConfiguration } from './validation';

export let _configuration: InitialzeOptions;

const startPolling = (configuration: InitialzeOptions) => {
  const { pollingEnabled, pollIntervalSeconds } = configuration;

  if (pollingEnabled) {
    setInterval(() => {
      refreshStore().catch((err) => {
        // TODO error handle
      });
    }, pollIntervalSeconds * 1000);
  }
};

export const initialize = async (options: InitialzeOptions) => {
  try {
    validateConfiguration(options);
    _configuration = Object.freeze(options);

    initializeGraphQLClient(_configuration);
    await refreshStore();
    startPolling(_configuration);
  } catch (err) {
    if (err instanceof InitilizationError) {
      throw err;
    }
  }
};
