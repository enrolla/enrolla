import { initializeGraphQLClient } from '../api';
import { InitialzeOptions } from '../interfaces';

export let _configuration: InitialzeOptions;

export const init = (options: InitialzeOptions) => {
  _configuration = Object.freeze(options);

  initializeGraphQLClient(_configuration);
};
