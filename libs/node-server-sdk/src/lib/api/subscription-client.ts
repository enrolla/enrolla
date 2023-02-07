import * as WebSocket from 'ws';
import { createClient } from 'graphql-ws';
import { _configuration } from '../configuration';
import { Customer, CustomerForSubscription } from '@enrolla/graphql-codegen';
import { setCustomerFeatures, setCustomerSecrets } from '../store';
import { DataPushError } from '../errors';

export const subscribeToUpdates = async (url: string) => {
  class AuthorizedSocket extends WebSocket {
    constructor(address, protocols) {
      super(address, protocols, {
        headers: {
          Authorization: `Bearer ${_configuration.apiToken}`,
        },
      });
    }
  }

  try {
    const client = createClient({
      url: url.replace('http', 'ws').replace('https', 'ws'),
      webSocketImpl: AuthorizedSocket,
      shouldRetry: () => true,
    });

    await client.subscribe<CustomerForSubscription>(
      {
        query: `subscription {
                  customerUpdated {
                    organizationId
                    secrets {
                      key
                      value
                    }
                    effectiveConfiguration {
                      value
                      feature {
                        key
                        type
                        defaultValue
                      }
                    }
                  }
                }`,
      },
      {
        next: (res) => {
          if (res?.errors) {
            _configuration.pushUpdates?.onError?.(
              new DataPushError(res.errors?.[0]?.message)
            );
          } else {
            const updatedCustomer = (res.data as unknown as any)
              .customerUpdated as Pick<
              Customer,
              'organizationId' | 'secrets' | 'effectiveConfiguration'
            >;
            setCustomerFeatures(updatedCustomer);
            setCustomerSecrets(updatedCustomer);
          }
        },
        error: (error: unknown) => {
          _configuration.pushUpdates?.onError?.(
            new DataPushError('Unknown Error', error as Error)
          );
        },
        complete: () => {}, // eslint-disable-line
      }
    );
  } catch (err) {
    _configuration.pushUpdates?.onError?.(
      new DataPushError('Unknown Error', err as Error)
    );
  }
};
