// This is an adaptation from https://github.com/refinedev/refine/blob/master/packages/graphql/src/dataProvider/index.ts
// Since currently our API is a bit different (we don't support pagination, sorting, filters, etc.)
import { DataProvider } from '@pankod/refine-core';
import { GraphQLClient } from 'graphql-request';
import * as gql from 'gql-query-builder';
import pluralize from 'pluralize';
import camelCase from 'camelcase';

const dataProvider = (client: GraphQLClient): DataProvider => {
  return {
    getList: async ({
      resource,
      hasPagination = true,
      pagination = { current: 1, pageSize: 10 },
      sort,
      filters,
      metaData,
    }) => {
      const camelResource = camelCase(resource);

      const operation = metaData?.operation ?? camelResource;

      const { query, variables } = gql.query({
        operation,
        variables: {
          ...metaData?.variables,
        },
        fields: metaData?.fields,
      });

      const response = await client.request(query, variables);

      return {
        data: response[operation],
        total: response[operation].count,
      };
    },

    create: async ({ resource, variables, metaData }) => {
      const singularResource = pluralize.singular(resource);
      const camelCreateName = camelCase(`create-${singularResource}`);
      const inputName = camelCase(`create-${singularResource}-input`, {
        pascalCase: true,
      });

      const operation = metaData?.operation ?? camelCreateName;

      const { query, variables: gqlVariables } = gql.mutation({
        operation,
        variables: {
          input: {
            value: variables,
            type: inputName,
            required: true,
          },
        },
        fields: metaData?.fields ?? ['id'],
      });
      const response = await client.request(query, gqlVariables);

      return {
        data: response[operation][singularResource],
      };
    },

    createMany: async ({ resource, variables, metaData }) => {
      const singularResource = pluralize.singular(resource);
      const camelCreateName = camelCase(`create-${singularResource}`);

      const operation = metaData?.operation ?? camelCreateName;

      const response = await Promise.all(
        variables.map(async (param) => {
          const { query, variables: gqlVariables } = gql.mutation({
            operation,
            variables: {
              input: {
                value: { data: param },
                type: `${camelCreateName}Input`,
              },
            },
            fields: metaData?.fields ?? [
              {
                operation: singularResource,
                fields: ['id'],
                variables: {},
              },
            ],
          });
          const result = await client.request(query, gqlVariables);

          return result[operation][singularResource];
        })
      );
      return {
        data: response,
      };
    },

    update: async ({ resource, id, variables, metaData }) => {
      const singularResource = pluralize.singular(resource);
      const camelUpdateName = camelCase(`update-${singularResource}`);
      const inputName = camelCase(`update-${singularResource}-input`, {
        pascalCase: true,
      });

      const operation = metaData?.operation ?? camelUpdateName;

      const { query, variables: gqlVariables } = gql.mutation({
        operation,
        variables: {
          input: {
            value: { id, ...variables },
            type: inputName,
            required: true,
          },
        },
        fields: metaData?.fields ?? [
          {
            operation: singularResource,
            fields: ['id'],
            variables: {},
          },
        ],
      });
      const response = await client.request(query, gqlVariables);

      return {
        data: response[operation][singularResource],
      };
    },

    updateMany: async ({ resource, ids, variables, metaData }) => {
      const singularResource = pluralize.singular(resource);
      const camelUpdateName = camelCase(`update-${singularResource}`);

      const operation = metaData?.operation ?? camelUpdateName;

      const response = await Promise.all(
        ids.map(async (id) => {
          const { query, variables: gqlVariables } = gql.mutation({
            operation,
            variables: {
              input: {
                value: { where: { id }, data: variables },
                type: `${camelUpdateName}Input`,
              },
            },
            fields: metaData?.fields ?? [
              {
                operation: singularResource,
                fields: ['id'],
                variables: {},
              },
            ],
          });
          const result = await client.request(query, gqlVariables);

          return result[operation][singularResource];
        })
      );
      return {
        data: response,
      };
    },

    getOne: async ({ resource, id, metaData }) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(singularResource);

      const operation = metaData?.operation ?? camelResource;

      const { query, variables } = gql.query({
        operation,
        variables: {
          id: { value: id, type: 'String', required: true },
        },
        fields: metaData?.fields,
      });

      const response = await client.request(query, variables);

      return {
        data: response[operation],
      };
    },

    deleteOne: async ({ resource, id, metaData }) => {
      const singularResource = pluralize.singular(resource);
      const camelDeleteName = camelCase(`remove-${singularResource}`);

      const operation = metaData?.operation ?? camelDeleteName;

      const { query, variables } = gql.mutation({
        operation,
        variables: {
          id: { value: id, type: 'String', required: true },
        },
        fields: metaData?.fields ?? ['id'],
      });

      const response = await client.request(query, variables);

      return {
        data: response[operation][singularResource],
      };
    },

    deleteMany: async ({ resource, ids, metaData }) => {
      throw Error('Not implemented.');
    },

    getApiUrl: () => {
      throw Error('Not implemented.');
    },

    custom: async ({ url, method, headers, metaData }) => {
      let gqlClient = client;

      if (url) {
        gqlClient = new GraphQLClient(url, { headers });
      }

      if (metaData) {
        if (metaData.operation) {
          if (method === 'get') {
            const { query, variables } = gql.query({
              operation: metaData.operation,
              fields: metaData.fields,
              variables: metaData.variables,
            });

            const response = await gqlClient.request(query, variables);

            return {
              data: response[metaData.operation],
            };
          } else {
            const { query, variables } = gql.mutation({
              operation: metaData.operation,
              fields: metaData.fields,
              variables: metaData.variables,
            });

            const response = await gqlClient.request(query, variables);

            return {
              data: response[metaData.operation],
            };
          }
        } else {
          throw Error('GraphQL operation name required.');
        }
      } else {
        throw Error(
          'GraphQL need to operation, fields and variables values in metaData object.'
        );
      }
    },
  };
};

export default dataProvider;
