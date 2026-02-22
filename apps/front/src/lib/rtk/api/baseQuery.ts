import { TGraphQLArgs, TGraphQLResponse, GraphQLErrorItem } from "@/types/rtk";
import { TGraphQLBaseQueryError } from "@/types/rtk";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { print } from "graphql";

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isGraphQLErrorItem = (v: unknown): v is GraphQLErrorItem => {
  if (!isObject(v)) return false;
  return typeof v.message === "string";
};

const getFirstGraphQLErrorMessage = (errors: unknown): string | null => {
  if (!Array.isArray(errors) || errors.length === 0) return null;
  const first = errors[0];
  if (!isGraphQLErrorItem(first)) return null;
  return first.message;
};

export const graphqlBaseQuery =
  (): BaseQueryFn<TGraphQLArgs, unknown, TGraphQLBaseQueryError> =>
  async ({ document, variables }) => {
    const query = print(document);
    const res = await fetch("/api/gql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query, variables }),
    });

    const json = (await res
      .json()
      .catch(() => null)) as TGraphQLResponse<unknown> | null;
    const gqlMessage = getFirstGraphQLErrorMessage(json?.errors);
    const hasGqlErrors =
      typeof gqlMessage === "string" && gqlMessage.length > 0;
    if (!res.ok || hasGqlErrors) {
      const msg = gqlMessage ?? `GraphQL failed (${res.status})`;
      return {
        error: {
          status: res.status,
          error: msg,
          data: json ?? undefined,
        },
      };
    }
    return { data: json?.data };
  };
