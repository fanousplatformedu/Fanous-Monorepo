import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/graphql`
    : "http://localhost:5700/graphql",
  documents: ["src/lib/gql/documents/**/*.gql"],
  generates: {
    "src/lib/gql/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        avoidOptionals: true,
        maybeValue: "T | null",
      },
    },
  },
};

export default config;
