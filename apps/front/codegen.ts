import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5700/graphql",
  documents: ["src/lib/graphql/documents/**/*.gql"],
  generates: {
    "src/lib/graphql/generated/graphql.ts": {
      plugins: [],
      preset: "graphql-tag-operations-preset",
      presetConfig: {
        // خروجی TypedDocumentNode + Types
        // تمام عملیات از روی *.gql استخراج می‌شود
        // و هم query/mutation string و هم typeها را تولید می‌کند
      },
    },
  },
};

export default config;
