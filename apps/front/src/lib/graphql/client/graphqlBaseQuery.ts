import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { print } from "graphql";
import { env } from "@/lib/config/env";

type GraphQLBaseQueryArgs = {
  document: TypedDocumentNode<any, any>;
  variables?: Record<string, any>;
};

type GraphQLErrorShape = {
  message: string;
  code?: string;
};

export const graphqlBaseQuery =
  (): BaseQueryFn<GraphQLBaseQueryArgs, unknown, GraphQLErrorShape> =>
  async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: env.GRAPHQL_URL,
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await rawBaseQuery(
      {
        url: "",
        body: {
          query: print(args.document),
          variables: args.variables ?? {},
        },
      },
      api,
      extraOptions,
    );

    // fetch error
    if (result.error)
      return {
        error: {
          message: "NETWORK_ERROR",
          code: "NETWORK_ERROR",
        },
      };

    const data = result.data as any;

    // graphql errors
    if (data?.errors?.length) {
      const e = data.errors[0];
      return {
        error: {
          message: e.message ?? "GRAPHQL_ERROR",
          code: e.extensions?.code,
        },
      };
    }

    return { data: data.data };
  };
