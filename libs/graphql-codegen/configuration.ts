import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'apps/enrolla-server/src/schema.gql',
  documents: 'libs/graphql-codegen/fragments/**/*.graphql',
  generates: {
    'libs/graphql-codegen/output/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ]
    },
    'libs/graphql-codegen/output/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
