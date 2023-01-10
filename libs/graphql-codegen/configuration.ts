import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'apps/enrolla-server/src/schema.gql',
  documents: 'libs/graphql-codegen/src/queries/**/*.graphql',
  generates: {
    'libs/graphql-codegen/src/output/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
    },
  },
};

export default config;
