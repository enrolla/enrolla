import * as jwt from 'jsonwebtoken';
import { Context } from 'graphql-ws';

/**
 * @see https://docs.nestjs.com/graphql/subscriptions#authentication-over-websockets
 * @param context
 */
export const graphqlWsOnConnect = (context: Context<any>) => {
  const extra = context.extra as any;
  const authHeader = extra?.request.headers['authorization'];
  try {
    const decoded = jwt.verify(
      authHeader?.split(' ')?.[1],
      process.env.API_TOKEN_GENERATION_PRIVATE_KEY
    );

    extra.tenantId = decoded['tenantId'];
  } catch (error) {}
};
