import { GraphQLClient } from 'graphql-request';
import {
  CreateCustomerInput,
  getSdk,
  Sdk,
  UpdateCustomerByOrgIdInput,
} from '@enrolla/graphql-codegen';
import { InitializeOptions } from '../interfaces';
import { DEFAULT_URL } from './constants';
import { subscribeToUpdates } from './subscription-client';

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

  subscribeToUpdates(_url);
};

export const fetchAllCustomerData = async () => _client.getAllCustomerData();
export const createCustomer = async (input: CreateCustomerInput) =>
  _client.createCustomer({ input });
export const updateCustomerByOrgId = async (
  input: UpdateCustomerByOrgIdInput
) => _client.updateCustomerByOrgId({ input });
