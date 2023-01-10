import { initializeGraphQLClient } from '../api';
import { InitialzeOptions } from '../interfaces';
import { refreshStore } from '../store';

export let _configuration: InitialzeOptions;

export const initialize = async (options: InitialzeOptions) => {
  try {
    _configuration = Object.freeze(options);

    initializeGraphQLClient(_configuration);
    await refreshStore();
  } catch (err) {
    // TODO error handle
  }
};
