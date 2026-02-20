import { TypedDocumentNode } from "@graphql-typed-document-node/core";

export type TGraphqlRequest<
  TVars extends Record<string, unknown> = Record<string, unknown>,
> = {
  document: unknown;
  variables?: TVars;
};

export type TGraphqlBaseQueryError = {
  data?: unknown;
  error?: string;
  status?: number;
};

export type TGraphQLArgs<
  Vars extends Record<string, unknown> = Record<string, unknown>,
> = {
  document: TypedDocumentNode<unknown, Vars>;
  variables?: Vars;
};

export type TGraphQLErrorShape = {
  data?: unknown;
  error?: string;
  status?: number;
};

export type TGraphQLResponse = {
  data?: unknown;
  errors?: Array<{ message?: string }>;
};
