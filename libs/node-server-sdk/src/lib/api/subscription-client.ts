import * as WebSocket from 'ws';
import { createClient, SubscribePayload } from 'graphql-ws';
import { _configuration } from '../configuration';

export const initializeAndSubscribe = async () => {
    class AuthorizedSocket extends WebSocket {
        constructor(address, protocols) {
          super(address, protocols, {
            headers: {
              Authorization: `Bearer ${_configuration.apiToken}`,
            },
          });
        }
      }

    const client = createClient({
        url: 'ws://localhost:3000/graphql',
        webSocketImpl: AuthorizedSocket,
        shouldRetry: () => true,
      });

    async function execute<T>(payload: SubscribePayload) {
        return new Promise<T>((resolve, reject) => {
          let result: T;
          client.subscribe<T>(payload, {
            next: (data) => (result = data as T),
            error: reject,
            complete: () => resolve(result),
          });
        });
      }
      
      // use
      (async () => {
        try {
          const result = await execute({
            query: '{ hello }',
          });

          console.log(result)
          // complete
          // next = result = { data: { hello: 'Hello World!' } }
        } catch (err) {
          // error
        }
      })();

}