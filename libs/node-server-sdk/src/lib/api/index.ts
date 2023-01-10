import { GraphQLClient } from 'graphql-request';
import { getSdk, Sdk } from '@enrolla/graphql-codegen';
import { InitialzeOptions } from '../interfaces';
import { DEFAULT_URL } from './constants';

let _client: Sdk;

export const initializeGraphQLClient = (options: InitialzeOptions) => {
  const { apiToken, url } = options;
  const _url = url ?? DEFAULT_URL;

  const graphQLClient = new GraphQLClient(_url, {
    headers: {
      token: apiToken,
    },
  });

  _client = getSdk(graphQLClient);
};

export const fetchAllCustomerFeatures = async () =>
  _client.getAllCustomerFeatures();
