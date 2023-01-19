import { GraphQLClient } from 'graphql-request';
import { getSdk, Sdk } from '@enrolla/graphql-codegen';
import { InitializeOptions } from '../interfaces';
import { DEFAULT_URL } from './constants';

let _client: Sdk;

export const initializeGraphQLClient = (options: InitializeOptions) => {
  const { apiToken, url } = options;
  const _url = url ?? DEFAULT_URL;

  const graphQLClient = new GraphQLClient(_url, {
    headers: {
      authorization: `Bearer: ${apiToken}`,
    },
  });

  _client = getSdk(graphQLClient);
};

export const fetchAllCustomerData = async () => _client.getAllCustomerData();
