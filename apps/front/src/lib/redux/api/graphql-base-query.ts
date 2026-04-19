import { TGraphqlBaseQueryArgs, TGraphqlResponse } from "@/types/rtk-query";
import { fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query";
import { GraphqlBaseQueryError } from "@/types/rtk-query";
import { GRAPHQL_ENDPOINT } from "@/utils/constant";
import { print } from "graphql";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: GRAPHQL_ENDPOINT,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("accept", "application/json");
    headers.set("content-type", "application/json");
    return headers;
  },
});

export const graphqlBaseQuery: BaseQueryFn<
  TGraphqlBaseQueryArgs,
  unknown,
  GraphqlBaseQueryError
> = async ({ document, variables }, api, extraOptions) => {
  const query = typeof document === "string" ? document : print(document);
  const result = await rawBaseQuery(
    {
      url: "",
      method: "POST",
      body: {
        query,
        variables: variables ?? {},
      },
    },
    api,
    extraOptions,
  );

  if ("error" in result && result.error)
    return { error: result.error as GraphqlBaseQueryError };
  const response = (result.data ?? {}) as TGraphqlResponse;
  if (response.errors?.length) {
    return {
      error: {
        status: "GRAPHQL_ERROR",
        data: {
          message: response.errors[0]?.message ?? "GraphQL error",
          errors: response.errors,
        },
      },
    };
  }
  return {
    data: response.data ?? null,
  };
};
