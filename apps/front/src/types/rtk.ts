import type { DocumentNode } from "graphql";

export type TGraphQLArgs<
  TVariables extends Record<string, unknown> = Record<string, unknown>,
> =
  | {
      document: DocumentNode;
      variables?: TVariables;
    }
  | {
      document: DocumentNode;
      variables: TVariables;
    };

export type GraphQLErrorExtensions = {
  code?: string;
  [key: string]: unknown;
};

export type GraphQLErrorItem = {
  message: string;
  extensions?: GraphQLErrorExtensions;
  path?: ReadonlyArray<string | number>;
};

export type TGraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLErrorItem[];
};

export type TGraphQLBaseQueryError = {
  status: number;
  error: string;
  data?: unknown;
};
