import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/lib/gql/schema/schema.json",
  documents: ["./src/lib/graphql/documents/**/*.graphql"],
  generates: {
    "./src/lib/graphql/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: true,
          defaultValue: true,
        },
        maybeValue: "T | null",
        inputMaybeValue: "T | null | undefined",
        scalars: {
          DateTime: "string",
          JSON: "unknown",
          Json: "unknown",
        },
      },
    },
  },
  ignoreNoDocuments: false,
};

export default config;
