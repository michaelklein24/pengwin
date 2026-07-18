import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../backend/src/graphql/schema.graphql',
  documents: ['graphql/operations/**/*.graphql'],
  generates: {
    'graphql/generated/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },
      config: {
        enumsAsTypes: true,
        skipTypename: true,
        useTypeImports: true,
        documentMode: 'string',
      },
    },
  },
};

export default config;
